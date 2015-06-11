<?php
class aa{
    /**
     * 天翼开放平台短信发送
     * @param  string  $mobile_number  手机号码
     * @return bool                 发送状态
     */
    protected function _open189_sms($mobile_number){
    	//常用参数
    	$app_id = '338754180000043231';
    	$app_secret = '885152c34049656ef03cb14e16b5b7ba';
    	//获取令牌
        $url = 'https://oauth.api.189.cn/emp/oauth2/v3/access_token';
        $body = [
            'grant_type'=>'client_credentials',
            'app_id'=>$app_id,
            'app_secret'=>$app_secret
        ];
        $response_body = self::_restful_post($url,$body);
        if($response_body->res_code == 0){
        	$access_token = $response_body->access_token;
        	//获取信任码
        	$url = 'http://api.189.cn/v2/dm/randcode/token';
        	$body = [
        		'app_id'=>$app_id,
        		'access_token'=>$access_token,
        		'timestamp'=>date('Y-m-d H:i:s')
        	];
        	ksort($body);
            $plaintext = [];
            foreach ($body as $key => $value) {
                $plaintext[] = $key.'='.$value;
            }
        	$body['sign']=rawurlencode(base64_encode(hash_hmac("sha1", implode("&",$plaintext), $app_secret, True)));
        	ksort($body);

        	$response_body = self::_restful_get($url,$body);
        	//下发短信
        	if($response_body->res_code == 0){
        		$token = $response_body->token;
        		$url = "http://api.189.cn/v2/dm/randcode/sendSms";
	        	$body = [
	        		'app_id'=>$app_id,
	        		'access_token'=>$access_token,
	        		'token'=>$token,
	        		'phone'=>$mobile_number,
	        		'randcode'=>round(111111,999999),
	        		'timestamp'=>date('Y-m-d H:i:s')
	        	];
	        	ksort($body);
	            $plaintext = [];
	            foreach ($body as $key => $value) {
	                $plaintext[] = $key.'='.$value;
	            }
	        	$body['sign']=rawurlencode(base64_encode(hash_hmac("sha1", implode("&",$plaintext), $app_secret, True)));
	        	ksort($body);

	        	$response_body = self::_restful_post($url,$body);
	        	if($response_body->res_code == 0){
                    return true;
                }
        	}
        }
        return false;
    }
    
    /**
     * http post 请求
     * @param  string $url    
     * @param  array|string $body
     * @param  array  $headers 
     * @return object
     */
    static private function _restful_post($url, $body, $headers=["Accept" => "application/json"]){
        if(is_array($body)){
            $plaintext = [];
            foreach ($body as $key => $value) {
                $plaintext[] = $key.'='.$value;
            }
            $body = implode('&', $plaintext);
        }

        $response = RestfulClient::post($url, $headers, $body);
        return $response->body;
    }
    /**
     * http get 请求
     * @param  string $url    
     * @param  array|string $body
     * @param  array  $headers 
     * @return object
     */
    static private function _restful_get($url, $body='', $headers=["Accept" => "application/json"]){
        $response = RestfulClient::get($url, $headers, $body);
        return $response->body;
    }
}
