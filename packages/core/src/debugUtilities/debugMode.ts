import logger from '../logger';

let debugMode = false;

export const enableDebugMode = () => {
    logger.setLevel('debug');
    debugMode = true;
};

export const disableDebugMode = () => {
    logger.resetLevel();
    debugMode = false;
};

export const isDebugMode = () => debugMode;
