import type { IExecuteFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';

export async function gologinApiRequest(
	context: { getNodeParameter: IExecuteFunctions['getNodeParameter']; helpers: IExecuteFunctions['helpers'] },
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
) {
	const options = {
		method,
		body,
		qs,
		url: `https://api.gologin.com${endpoint}`,
		json: true,
	};

	return await context.helpers.requestWithAuthentication.call(context as IExecuteFunctions, 'gologinApi', options);
}

export async function gologinApiRequestAllItems(
	context: { getNodeParameter: IExecuteFunctions['getNodeParameter']; helpers: IExecuteFunctions['helpers'] },
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
) {
	const returnData: IDataObject[] = [];
	let page = 1;
	let responseData;

	do {
		const queryParams = { ...qs, page };
		responseData = await gologinApiRequest(context, method, endpoint, body, queryParams);
		
		if (responseData.profiles) {
			returnData.push(...responseData.profiles);
			page++;
		} else if (Array.isArray(responseData)) {
			returnData.push(...responseData);
			break;
		} else {
			returnData.push(responseData);
			break;
		}
	} while (responseData.profiles && responseData.profiles.length > 0);

	return returnData;
}


