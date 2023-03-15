"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeClient = void 0;
const { TranscribeClient } = require("@aws-sdk/client-transcribe");
// Set the AWS Region.
const REGION = "us-west-2"; //e.g. "us-east-1"
// Create an Amazon Transcribe service client object.
const transcribeClient = new TranscribeClient({ region: REGION });
exports.transcribeClient = transcribeClient;
