const parseEnvNumber = (envVar) => {
  const envVarValue = parseInt(import.meta.env[envVar]);
  if (isNaN(envVarValue)) {
    throw new Error(`Environment variable ${envVar} is not a number`);
  }
  return envVarValue;
};

const parseEnvString = (envVar) => {
  const envVarValue = import.meta.env[envVar];
  if (!envVarValue) {
    throw new Error(`Environment variable ${envVar} is not set`);
  }
  return envVarValue;
};

const parseEnvBoolean = (envVar) => {
  const envVarValue = import.meta.env[envVar];
  if (!envVarValue) {
    throw new Error(`Environment variable ${envVar} is not set`);
  }
  return envVarValue === "true";
};

const getEnvVariables = () => {
  const miniMarketApiServer = parseEnvString("VITE_MINIMARKET_API");
  //const nodeEnv = parseEnvString("NODE_ENV"); // Vite maneja NODE_ENV sin el prefijo VITE_
  const miniMarketApiServerService = parseEnvString(
    "VITE_MINIMARKET_API_SERVICE"
  );
  // const facebookUri = parseEnvString("VITE_FACEBOOK_URI");
  // const whatsappUri = parseEnvString("VITE_WHATSAPP_URI");
  // const telegramUri = parseEnvString("VITE_TELEGRAM_URI");
  const nodeEnv = import.meta.env.MODE || "development";
  return {
    nodeEnv,
    miniMarketApiServer,
    miniMarketApiServerService,
    // facebookUri,
    // whatsappUri,
    // telegramUri,
  };
};

export default getEnvVariables;
