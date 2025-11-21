# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-20

### Added
- Initial release of n8n-nodes-geminigen
- Support for GeminiGen AI video generation
- Multiple AI model options (Veo 3, Veo 3 Fast, Sora 2, Sora 2 Pro)
- Dynamic endpoint routing based on selected model
- Proper API polling for video generation completion
- Comprehensive error handling with NodeOperationError
- SVG icons for light and dark themes
- Complete credential setup for API authentication
- TypeScript support with proper typing
- ESLint configuration for code quality
- Comprehensive documentation and usage examples

### Features
- Generate videos from text prompts
- Real-time status polling with timeout protection
- Support for both Veo and Sora model families
- Detailed response data including video URL and thumbnail
- Error handling with continue-on-fail support
- Professional n8n node integration

### Technical
- Built with TypeScript 5.0
- Compatible with n8n API version 1
- Follows n8n community node best practices
- Proper build pipeline with asset copying
- Comprehensive test coverage for API integration