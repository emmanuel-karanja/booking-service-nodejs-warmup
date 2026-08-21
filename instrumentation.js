import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor
} from '@opentelemetry/sdk-trace-node';

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  spanProcessors: [
    new SimpleSpanProcessor(new ConsoleSpanExporter())
  ],
  instrumentations: [
    getNodeAutoInstrumentations()
  ]
});

sdk.start();