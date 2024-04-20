<?php
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE);

function fetch($url, $options): array
{
    if(!isset($options['headers'])) {
        $options['headers'] = [];
    }

    $ch = curl_init();

    // 设置cURL选项
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST,$options['method'] ?? 'GET');
    curl_setopt($ch, CURLOPT_HTTPHEADER, array_map(
        fn($v) => $v . ': ' .$options['headers'][$v], array_keys($options['headers'])
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_HEADER, true);

    $response = curl_exec($ch);

    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    list($headers,$body) = explode("\r\n\r\n", $response, 2);

    $headers = explode("\r\n", $headers);
    $headers = array_filter(
        $headers, fn($v) => preg_match('/(Content-Type|Location|Cache-Control|Date|Etag|Expires|Last-Modified):/i', $v)
    );

    $headers = array_combine(
        array_map(fn($v) => explode(': ', $v)[0], $headers),
        array_map(fn($v) => explode(': ', $v)[1], $headers),
    );

    $body = $body ?? '';    

    return compact('body', 'status', 'headers');
}

function jsURL($url): stdClass
{
    $parseUrl = (object)parse_url($url);
    if(!$parseUrl->scheme) {
        throw new Exception('Invalid URL');
    }
    $parseUrl->origin = $parseUrl->scheme . '://' . $parseUrl->host;
    $parseUrl->pathdir = preg_replace('/\w+.\w+$/', '', $parseUrl->path);
    $parseUrl->href = $url;
    return $parseUrl;
}

function filterM3U8NotSort($content) {
    $prev = 0;
    $isSort = true;
    $matches = array_values(preg_grep('/\w+.ts/', explode("\n",$content)));
    
    return array_values(array_filter($matches, function($i,$idx) use (&$prev, &$isSort) {
        $current = intval(preg_replace('/.*?(\d+).ts/', '$1', $i));
        $isNotSort = ($current - $prev) != 1;

        if ($idx == 0 || !$isNotSort) {
            $prev = $current;
        }

        if ($idx == 1 &&$isNotSort) {
            $isSort = false;
        }

        if (!$isSort) {
            return false;
        }

        return $idx > 0 &&$isNotSort;
    }, ARRAY_FILTER_USE_BOTH));
}

function generateRegexpFromStrings($array){
    $baseString =$array[0];
    $commonString =$baseString;

    foreach ($array as $str) {
        for ($i = 0;$i < strlen($baseString) &&$i < strlen($str);$i++) {
            if ($baseString[$i] != $str[$i]) {
                $commonString[$i] = '*';
            }
        }
    }
    return preg_replace_callback('/\*+/', function($match) {
        $len = strlen($match[0]);
        return '\w'.($len > 1 ? '{'.$len.'}' : '');
    }, $commonString);
}
function removeM3U8Ads($content, $list) {
    $regex = '/.*?\s'.generateRegexpFromStrings($list).'\s/';
    $content = preg_replace($regex, '', $content);

    return $content;
}
function m3u8BodyHandler($body, $url){
    $hasTs = strstr($body, '.ts');
    $hasM3u8 = strstr($body, '.m3u8');
    if(!$hasTs && !$hasM3u8){
        return $body;
    }

    // 统一内容路径, 绝对转相对
    $body = str_replace($url->pathdir, '', $body);
    
    if($hasTs){
        $body = preg_replace('/.*?\s\/\S+\s/', '', $body);
        $body = preg_replace('/#EXT-X-K.*?\s(.*\s)*?.*?Y\s/', '', $body); //ukzy
        
        $ads = filterM3U8NotSort($body);
        // print_r($ads);
        if(count($ads)) {
            $body = removeM3U8Ads($body, $ads);
        }
    }
    return $body;
}
function getCurrentUrl(){
    $defaultUrl = 'https://httpbun.com/anything'.$_SERVER['REQUEST_URI'];
    $url = 'https:/'.$_SERVER['REQUEST_URI'];
    // $url = 'https://ukzy.ukubf8.com/20240418/gDkT65mK/2000kb/hls/index.m3u8';
    // $url = 'https://yzzy1.play-cdn20.com/20240417/38131_a1c8acbe/index.m3u8';
    $url = 'https://s3.bfengbf.com/video/leizhinvwang/第13集/index.m3u8';
    try{
        $url = jsURL($url);
    }catch(Exception $e){
        $url = jsURL($defaultUrl);
    }
    if(empty($url->host)){
        $url = jsURL($defaultUrl);
    }
    
    return $url;
}


$url = getCurrentUrl();

$options = [
    'headers' => [
        'User-Agent' => $_SERVER['HTTP_USER_AGENT'],
        'Referer' => $_SERVER['HTTP_REFERER'] ?? $url->origin,
    ]
];

$res = fetch($url->href, $options);

preg_match('/.*?m3u8/', $res['body'], $bodyMatches);
if(!empty($bodyMatches[0])){
    $url = jsURL($url->origin . $url->pathdir . str_replace($url->pathdir, '', $bodyMatches[0]));
    $res = fetch($url->href, $options);
}


$res['body'] = m3u8BodyHandler($res['body'], $url);
$res['body'] = preg_replace('/(\w+.ts)/', $url->origin.$url->pathdir.'$1', $res['body']);

http_response_code($res['status']);
foreach($res['headers'] as $k => $v) {
    header($k . ': ' . $v);
}
echo $res['body'];
