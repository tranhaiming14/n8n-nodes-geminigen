import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

export class Geminigen implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Geminigen',
        name: 'Geminigen',
        icon: 'file:geminigen.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Generate AI videos using Geminigen AI Veo API',
        documentationUrl: 'https://docs.geminigen.ai/getting-started/authentication',
        defaults: {
            name: 'Geminigen AI',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Generate Video using Veo and Sora Models',
                        value: 'generateVideo',
                        description: 'Generate Video using Veo and Sora Models',
                        action: 'Generate a video',
                    },
                ],
                default: 'generateVideo',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'Your Geminigen API key from https://geminigen.ai. Follow the guide to get your API key: https://docs.geminigen.ai/getting-started/authentication',
                hint: 'Follow the guide to get your API key: https://docs.geminigen.ai/getting-started/authentication',

            },
            {
                displayName: 'Prompt',
                name: 'prompt',
                type: 'string',
                default: '',
                required: true,
                description: 'Text description of the video you want to generate',
                placeholder: 'A sunny sandy summer beach with flying dogs',
                typeOptions: {
                    rows: 4,
                },
            },
            {
                displayName: 'Model',
                name: 'model',
                type: 'options',
                options: [
                    {
                        name: 'Veo 3',
                        value: 'veo-3',
                    },
                    {
                        name: 'Veo 3 Fast',
                        value: 'veo-3-fast',
                    },
                    {
                        name: 'Sora 2',
                        value: 'sora-2',
                    },
                    {
                        name: 'Sora 2 Pro',
                        value: 'sora-2-pro',
                    },
                ],
                default: 'veo-3-fast',
                required: true,
                description: 'The video generation model to use',
            },
            {
                displayName: 'Duration',
                name: 'duration',
                type: 'options',
                options: [
                    {
                        name: '8 seconds',
                        value: '8',
                    },
                    {
                        name: '10 seconds',
                        value: '10',
                    },
                    {
                        name: '15 seconds',
                        value: '15',
                    },
                ],
                default: '8',
                required: true,
                description: 'Video duration in seconds',
                hint: 'Note: Veo models only support 8 seconds. 10 and 15 seconds are only available for Sora models.',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const operation = this.getNodeParameter('operation', 0);

        for (let i = 0; i < items.length; i++) {
            try {
                if (operation === 'generateVideo') {
                    const prompt = this.getNodeParameter('prompt', i) as string;
                    const model = this.getNodeParameter('model', i) as string;
                    const duration = this.getNodeParameter('duration', i) as string;
                    const apiKey = this.getNodeParameter('apiKey', i) as string;

                    const endpoint = model.includes('sora') ? 'sora' : 'veo';

                    // Step 1: Submit video generation request
                    await this.helpers.httpRequest({
                        method: 'POST',
                        url: `https://api.geminigen.ai/uapi/v1/video-gen/${endpoint}`,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'x-api-key': apiKey,
                        },
                        body: {
                            "prompt": prompt,
                            "model": model,
                            "duration": duration,
                        },
                        json: true,
                    });

                    // Step 2: Poll for completion
                    const pollInterval = 10 * 1000; // 10 seconds
                    const maxWaitTime = 30 * 60 * 1000; 
                    const startTime = Date.now();

                    let videoReady = false;
                    let finalResult: any;

                    while (!videoReady) {
                        // Check if max wait time exceeded
                        if (Date.now() - startTime > maxWaitTime) {
                            throw new NodeOperationError(
                                this.getNode(),
                                'Video generation timed out after 30 minutes. Please try again later',
                                { itemIndex: i },
                            );
                        }

                        // Wait before checking status
                        await new Promise(resolve => setTimeout(resolve, pollInterval));

                        // Check status
                        const historyResponse = await this.helpers.httpRequest({
                            method: 'GET',
                            url: 'https://api.geminigen.ai/uapi/v1/histories',
                            qs: {
                                filter_by: 'all',
                                items_per_page: 10,
                                page: 1,
                            },
                            headers: {
                                'accept': 'application/json',
                                'x-api-key': apiKey,
                            },
                            json: true,
                        });

                        // Check if video is ready (status === 2)
                        if (historyResponse.result && historyResponse.result[0]?.status === 2) {
                            videoReady = true;

                            // Get full video details
                            const uuid = historyResponse.result[0].uuid;
                            finalResult = await this.helpers.httpRequest({
                                method: 'GET',
                                url: `https://api.geminigen.ai/uapi/v1/history/${uuid}`,
                                headers: {
                                    'accept': 'application/json',
                                    'x-api-key': apiKey,
                                },
                                json: true,
                            });
                        }
                    }

                    // Step 3: Format and return result
                    const videoUrl = finalResult?.generated_video?.[0]?.video_url;
                    const thumbnailUrl = finalResult?.thumbnail_url;

                    if (!videoUrl) {
                        throw new NodeOperationError(
                            this.getNode(),
                            'Video URL not found in response',
                            { itemIndex: i },
                        );
                    }

                    returnData.push({
                        json: {
                            videoUrl,
                            thumbnailUrl,
                            prompt,
                            model,
                            duration,
                            fullResponse: finalResult,
                        },
                        pairedItem: { item: i },
                    });
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}
