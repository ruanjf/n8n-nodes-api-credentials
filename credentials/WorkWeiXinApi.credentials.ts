import {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

export class WorkWeiXinApi implements ICredentialType {
	name = 'workWeiXinApi';
	displayName = '企业微信 API';
	documentationUrl = 'https://developer.work.weixin.qq.com/document/path/90664';
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'hidden',
			typeOptions: {
				expirable: true,
			},
			default: '',
		},
		{
			displayName: 'Expires At',
			name: 'expiresAt',
			type: 'hidden',
			typeOptions: {
				expirable: true,
			},
			default: '',
		},
		{
			displayName: 'Expires In',
			name: 'expiresIn',
			type: 'hidden',
			typeOptions: {
				expirable: true,
			},
			default: '',
		},
		{
			displayName: '企业ID',
			name: 'corpid',
			type: 'string',
			default: '',
			required: true,
			description: '每个企业都拥有唯一的corpid',
		},
		{
			displayName: '应用凭证密钥',
			name: 'corpsecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: '自建应用secret。在管理后台->“应用与小程序”->“应用”->“自建”，点进某个应用，即可看到。 基础应用secret。某些基础应用（如“审批”“打卡”应用），支持通过API进行操作。在管理后台->“应用与小程序”->“应用->”“基础”，点进某个应用，点开“API”小按钮，即可看到。',
		},
	];

	// method will only be called if "accessToken" (the expirable property)
	// is empty or is expired
	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		// make reques to get access token
		const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${credentials.corpid}&corpsecret=${credentials.corpsecret}`;
		const res = (await this.helpers.httpRequest({
			method: 'GET',
			url,
		})) as any;
		return {
			accessToken: res.access_token,
			expiresAt: new Date().getTime() + res.expires_in * 1000,
			// 凭证的有效时间（秒）
			expiresIn: res.expires_in,
		};
	}
	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		if (!credentials.expiresAt || (credentials.expiresAt as number + 5000) <= new Date().getTime()) {
			throw new Error("access_token expired")
		}
		if (!requestOptions.qs) {
			requestOptions.qs = {}
		}
		Object.assign(requestOptions.qs, { 'access_token': credentials.accessToken });

		return requestOptions;
	}
}
