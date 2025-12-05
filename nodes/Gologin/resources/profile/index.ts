import type { INodeProperties } from 'n8n-workflow';
import { getAllDescription } from './getAll';
import { getDescription } from './get';
import { createDescription } from './create';
import { updateDescription } from './update';
import { deleteDescription } from './del';

export const profileOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['profile'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new profile',
				action: 'Create a profile',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete one or more profiles',
				action: 'Delete profiles',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a profile by ID',
				action: 'Get a profile',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many profiles',
				action: 'Get many profiles',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a profile',
				action: 'Update a profile',
			},
		],
		default: 'getAll',
	},
];

export const profileFields: INodeProperties[] = [
	...getAllDescription,
	...getDescription,
	...createDescription,
	...updateDescription,
	...deleteDescription,
];


