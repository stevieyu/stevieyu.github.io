<?php
function url($url): int|array|string
{
    $parseUrl = parse_url($url);
    $parseUrl['origin'] = $parseUrl['scheme'] . '://' . $parseUrl['host'];
    return $parseUrl;
}

function encodeURI($uri): array|string|null
{
    return preg_replace_callback(
        "{[^0-9a-z_.!~*'();,/?:@&=+$#-]}i",
        fn ($m) => sprintf('%%%02X', ord($m[0])),
        $uri
    );
}

function fetchReplace($url): array|false|string|null
{
    // $proxy = 'https://hono.dgcf.link';
    $proxy = 'https://esm.sctes.stevie.top';

    $rules = [
        [
            'pattern' => '/(\n)(\/\w+\/)/',
            'replacement' => fn($url) => '$1' . $proxy.'/'.url($url)['host'] . '$2',
            'urlPattern' => '/(kuaikan).*\w+\.m3u8/'
        ],
        [
            'pattern' => '/(\w+)(_[^_]+?)(.ts)/',
            'replacement' => '$1$3',
            'urlPattern' => '/bfzy.*\w+\.m3u8/'
        ],
        [
            'pattern' => '/#E.*\n\/.*.ts\n|#EXT-X-DISCONTINUITY\n/',
            'replacement' => '',
            'urlPattern' => '/(bfzy|jiguangcdn).*\w+\.m3u8/'
        ],
        [
            'pattern' => '/(\n)(\/\w+\/)/',
            'replacement' => fn($url) => '$1' . url($url)['origin'] . '$2',
            'urlPattern' => '/\w+\.m3u8/'
        ],
        [
            'pattern' => '/(\n)(\w+.ts)/',
            'replacement' => fn($url) => '$1' . encodeURI(preg_replace('/\w+\.m3u8.*/', '', $url)) . '$2',
            'urlPattern' => '/\w+\.m3u8/'
        ],
        [
            'pattern' => '/\n\n/',
            'replacement' => "\n",
            'urlPattern' => '/\w+\.m3u8/'
        ],
    ];

//    if(!empty($proxy)) $url = preg_replace('/https:\//', $proxy, $url);

    error_log('fetch url: ' . $url);
    $context = stream_context_create([
        'http' => [
//            'ignore_errors' => true,
            'header' => implode("\n", [
                'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                'Referer: '. url($url)['origin'],
            ])
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ],
    ]);
    $body = file_get_contents($url, false, $context);
    $headers = array_filter($http_response_header, fn($v) => preg_match('/(Content-Type|Location|Cache-Control):/i', $v));
    $headers = array_combine(
        array_map(fn($v) => explode(': ', $v)[0], $headers),
        array_map(fn($v) => explode(': ', $v)[1], $headers),
    );
    $headers['C-Fetch'] = $url;

    // digitalocean 专属
    if(
        !empty($headers['Content-Type'])
         && !preg_match('/json|html|text/', $headers['Content-Type'])
    ) {
        $headers['C-Content-Type'] = $headers['Content-Type'];
        unset($headers['Content-Type']);
    }

    foreach ($rules as $rule) {
        if (!empty($rule['urlPattern']) && !preg_match($rule['urlPattern'], $url)) {
            continue;
        }
        $body = preg_replace(
            $rule['pattern'],
            is_callable($rule['replacement']) ? $rule['replacement']($url) : $rule['replacement'],
            $body
        );
    }

    return compact('body', 'headers');
}

function fetchUrl(array $args): array|string|null
{
    $url = array_values(
        array_filter(
            array_keys($args),
            fn($key) => preg_match('/^https?:\/\/\w+/', $key)
        )
    )[0] ?? '';

    if($url) {
        $url .= '='.$args[$url].'&'.http_build_query(array_filter($args, fn($v, $k) => $k != $url, ARRAY_FILTER_USE_BOTH));
    }else{
        $url = 'https://httpbun.com/anything?' . http_build_query($args);
    }

    $rules = [
        [
            'pattern' => '/jiguangapicom(\d+)[^\/]+/',
            'replacement' => 'cevip.jiguangcdn$1.com',
            'urlPattern' => '/jiguangapicom(\d+)/'
        ]
    ];

    foreach ($rules as $rule) {
        if (preg_match($rule['urlPattern'], $url)) {
            $url = preg_replace($rule['pattern'], $rule['replacement'], $url);
        }
    }
    return $url;
}

function main(array $args): array
{
    // digitalocean 专属
    $args = array_filter($args, fn($v, $k) => !preg_match('/headers|method|path|http/', $k), ARRAY_FILTER_USE_BOTH);
    return fetchReplace(fetchUrl($args));
}

$args = [];
//$args['https://s5.bfzycdn.com/video/lanman/第77集/index.m3u8'] = '';
//$args['https://jiguangapicom3.xn--ktv-6k6h473e.com/f51a5c05b94b42b72bc744f916484964/index.m3u8'] = '';
//$args['https://vip.kuaikan-cdn2.com/20230914/uZjkWbaG/index.m3u8'] = '';
//$args['https://m3u.haiwaikan.com/xm3u8/44acba99dc94f077143a88490fedaee41b9919d2fb006a3df34b8b37342b0e309921f11e97d0da21.m3u8'] = '';
$args['https://httpbun.com/anything?ac'] = 'list';
$args['pg'] = '1';
$res = main($args);
print_r($res);
