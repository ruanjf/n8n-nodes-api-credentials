import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';
import crypto from 'crypto';

export class YuQueApi implements ICredentialType {
	name = 'yuQueApi';
	displayName = '语雀 API';
	documentationUrl = 'https://www.yuque.com/yuque/developer/api';
	properties: INodeProperties[] = [
		{
			displayName: '应用名称',
			name: 'userAgent',
			type: 'string',
			default: 'n8n',
			required: true,
			description: '为了确保我们能知道访问者是谁，API 要求必须传递 User-Agent Header，否则将会拒绝请求',
			hint: '为了确保我们能知道访问者是谁，API 要求必须传递',
		},
		{
			displayName: 'Access Token',
			name: 'token',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: '语雀 API 目前使用 Token 机制来实现用户认证',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'User-Agent': '={{$credentials.userAgent}}',
				'X-Auth-Token': '={{$credentials.token}}',
			},
		},
	};
}
