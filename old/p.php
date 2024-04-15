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
    return compact('body', 'status', 'headers');
}

function jsURL($url): stdClass
{
    $parseUrl = (object)parse_url($url);
    if(!$parseUrl->scheme) {
        throw new Exception('Invalid URL');
    }
    $parseUrl->origin = $parseUrl->scheme . '://' . $parseUrl->host;
    $parseUrl->raw = $url;
    return $parseUrl;
}
function getCurrentUrl(){
    $url = 'https:/'.$_SERVER['REQUEST_URI'];
    try{
        return jsURL($url);
    }catch(Exception $e){
        return jsURL('https://httpbun.com/anything'.$_SERVER['REQUEST_URI']);
    }
    
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
function arrayDiffToStr($array){
    $baseString =$array[0];
    $commonString =$baseString;

    foreach ($array as $str) {
        for ($i = 0;$i < strlen($baseString) &&$i < strlen($str);$i++) {
            if ($baseString[$i] != $str[$i]) {
                $commonString[$i] = '*';
            }
        }
    }
    
    return str_replace('*', '\w', $commonString);
}
function removeM3U8Ads($content, $list) {
    $regex = '/(#EXT-X-DISCONTINUITY\s)?(.*?\s'.arrayDiffToStr($list).'\s){2,}/';
    $content = preg_replace($regex, '', $content);

    return $content;
}


$url = getCurrentUrl();
$options = [
    'headers' => [
        'User-Agent' => $_SERVER['HTTP_USER_AGENT'],
        'Referer' => $_SERVER['HTTP_REFERER'] ?? $url->origin,
    ]
];

$res = fetch($url->raw, $options);

http_response_code($res['status']);
foreach($res['headers'] as $k => $v) {
    header($k . ': ' . $v);
}


$ads = filterM3U8NotSort($res['body']);
if(count($ads)) {
    $res['body'] = removeM3U8Ads($res['body'], $ads);
}

echo $res['body'];
