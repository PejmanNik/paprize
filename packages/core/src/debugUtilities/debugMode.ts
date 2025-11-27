let debugMode = false;

export const enableDebugMode = () => {
    debugMode = true;
};

export const disableDebugMode = () => {
    debugMode = false;
};

export const isDebugMode = () => debugMode;
