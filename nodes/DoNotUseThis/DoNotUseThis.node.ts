import {
	IExecuteFunctions
} from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class DoNotUseThis implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Do Not Use This',
		name: 'doNotUseThis',
		group: ['transform'],
		version: 1,
		description: 'Do Not Use This',
		defaults: {
			name: 'Do Not Use This',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return this.prepareOutputData([]);
	}
}
