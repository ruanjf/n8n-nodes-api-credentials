import {
	ICredentialDataDecryptedObject,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
import crypto from 'crypto';

export class WeFeng implements ICredentialType {
	name = 'wefeng';
	displayName = '微丰 API';
	documentationUrl = '';
	properties: INodeProperties[] = [
		{
			displayName: 'API版本',
			name: 'apiVersion',
			type: 'options',
			options: [
				{
					name: 'V1、V2版本',
					value: 'V1_V2',
				},
				// {
				// 	name: 'HIGH/V1版本',
				// 	value: 'HIGH/V1',
				// },
			],
			default: 'V1_V2',
			description: '设置使用的版本',
			hint: '不同版本API鉴权方式有区别',
			required: true,
		},
		{
			displayName: 'API密钥',
			name: 'secretKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: '租户秘钥用于生成签名，获取路径：管理后台-->系统配置-->系统对接(页面底部的API密钥)',
		},
	];
	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {

		const timestamp = new Date().getTime();
		const stringToSign = `${credentials.secretKey}&${timestamp}`;
		const sign = crypto.createHash('sha256').update(stringToSign).digest("hex");
		if (!requestOptions.qs) {
			requestOptions.qs = {}
		}
		Object.assign(requestOptions.qs, { timestamp, sign });

		return requestOptions;
	}
}
