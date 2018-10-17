export type  LogLevel = 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG';

export namespace Logger {

	export function log(level: LogLevel, className: string, functionName: string, msg: any): void {
		console.log(`[${level}]\t[${className}] ${functionName}: `, msg);
	}

	export function logObj(level: LogLevel, className: string, functionName: string, obj: any): void {
		log(level, className, functionName, JSON.parse(JSON.stringify(obj)));
	}

}
