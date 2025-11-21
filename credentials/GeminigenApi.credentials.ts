import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class GeminigenApi implements ICredentialType {
    name = 'GeminigenApi';
    displayName = 'Geminigen API';
    documentationUrl = 'https://docs.geminigen.ai/';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'Your GeminiGen API key',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'x-api-key': '={{$credentials.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.geminigen.ai',
            url: '/uapi/v1/histories?filter_by=all&items_per_page=1&page=1',
            method: 'GET',
        },
    };
}
