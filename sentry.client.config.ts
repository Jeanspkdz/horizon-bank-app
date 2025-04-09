import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6c87441e309cdbe34708664602e87357@o4509114656030720.ingest.us.sentry.io/4509114683686912",

  integrations: [
    Sentry.replayIntegration(),
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});