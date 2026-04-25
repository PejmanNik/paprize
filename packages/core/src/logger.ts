// eslint-disable-next-line no-restricted-imports
import loglevel from 'loglevel';
import { loggerName } from './constants';

const logger = loglevel.getLogger(loggerName);
logger.setDefaultLevel('info');

export default logger;
