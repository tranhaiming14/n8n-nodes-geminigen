# n8n-nodes-geminigen

This is an n8n community node. It lets you use geminigen in your n8n workflows.

The GeminiGen.AI Video Generation API allows you to create high-quality videos from text prompts using state-of-the-art AI models. You can use this API to generate video content, animations, marketing materials, or any visual video content you can imagine.


[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes 

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-geminigen` in **Enter npm package name**
4. Select **Install**

### Manual Installation

To get started install the package in your n8n root directory:
```bash
npm install n8n-nodes-geminigen
```

For Docker-based deployments add the package to your [data directory](https://docs.n8n.io/hosting/configuration/configuration-methods/#mount-the-data-folder):
```bash
cd /path/to/.n8n/nodes
npm install n8n-nodes-geminigen
```

## Operations

Generate Video

## Credentials

In order to get the api key needed to use this node, you should visit https://geminigen.ai to sign up, click on your profile then API to generate the api key

## Compatibility

- Minimum n8n version: 1.0.0
- Tested against: n8n 1.0.0 and later versions
- No known version incompatibility issues

## Usage

### Basic Setup

1. **Install the node**: Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) to add this community node to your n8n instance.

2. **Set up credentials**: 
   - Visit [GeminiGen.AI](https://geminigen.ai) and sign up for an account
   - Go to your profile → API to generate an API key
   - In n8n, create new credentials of type "GeminiGen API" and enter your API key

3. **Add the node to your workflow**: Search for "GeminiGen" in the node palette and drag it into your workflow.

### Configuration

- **Prompt**: Enter a detailed text description of the video you want to generate (e.g., "A serene mountain landscape with flowing rivers and wildlife")
- **Model**: Choose from available AI models:
  - Veo 3, Veo 3 Fast (Google's Veo models)
  - Sora 2, Sora 2 Pro (OpenAI's Sora models)

### Example Workflow

1. **Trigger**: Use a Schedule Trigger to run daily
2. **GeminiGen Node**: Configure with your prompt and preferred model
3. **Output**: The generated video URL will be returned after generation is complete, please be patient since the video generation can take a few minutes.

### Tips

- More detailed prompts generally produce better results
- Video generation can take several minutes
- Check the "fullResponse" output for additional metadata about the generation
- If generation fails, the node will output the error message for debugging

For more advanced usage, combine with other n8n nodes to create automated video content workflows.

### Docs

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [GeminiGen API documentation](https://docs.geminigen.ai/)

