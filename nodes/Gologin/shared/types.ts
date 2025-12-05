export type ProxyMode = 'http' | 'socks4' | 'socks5' | 'possh' | 'geolocation' | 'none' | 'gologin' | 'tor';

export type OsType = 'lin' | 'mac' | 'win' | 'android' | 'android-cloud';

export type OsSpec = 'M1' | 'M2' | 'M3' | 'M4' | 'win11' | '';

export type WebRTCMode = 'alerted' | 'disabled' | 'real' | 'public' | 'fake';

export type GeolocationMode = 'prompt' | 'block' | 'allow';

export type Platform = 'Win32' | 'MacIntel' | 'Linux armv81' | 'Linux aarch64' | 'Linux x86_64' | 'Linux armv8l' | 'Linux armv7l';

export type Proxy = {
	mode: ProxyMode;
	host?: string;
	port?: number;
	username?: string;
	password?: string;
	id?: string;
	customName?: string;
	changeIpUrl?: string;
};

export type Navigator = {
	userAgent: string;
	resolution: string;
	language: string;
	platform: Platform;
	hardwareConcurrency?: number;
	deviceMemory?: number;
	maxTouchPoints?: number;
};

export type Geolocation = {
	mode: GeolocationMode;
	enabled?: boolean;
	customize?: boolean;
	fillBasedOnIp?: boolean;
	isCustomCoordinates?: boolean;
	latitude?: number;
	longitude?: number;
	accuracy?: number;
};

export type Timezone = {
	enabled?: boolean;
	fillBasedOnIp?: boolean;
	timezone?: string;
};

export type WebRTC = {
	mode: WebRTCMode;
	enable?: boolean;
	isEmptyIceList?: boolean;
};

export type Canvas = {
	mode: 'block' | 'noise' | 'off';
	noise?: number;
};

export type WebGL = {
	mode: 'off' | 'noise';
	noise?: number;
	getClientRectsNoise?: number;
};

export type WebGLMetadata = {
	mode: 'mask' | 'off';
	vendor?: string;
	renderer?: string;
};

export type AudioContext = {
	mode: 'noise' | 'off';
	noise?: number;
};

export type MediaDevices = {
	videoInputs: number;
	audioInputs: number;
	audioOutputs: number;
	enableMasking?: boolean;
	uid?: string;
};

export type Fonts = {
	families: string[];
	enableMasking?: boolean;
	enableDomRect?: boolean;
};

export type ClientRects = {
	mode: 'off' | 'noise';
	noise?: number;
};

export type BookmarkItem = {
	name: string;
	type: string;
	url: string;
};

export type BookmarkFolder = {
	children: BookmarkItem[];
	name: string;
	type: string;
};

export type Bookmarks = {
	bookmark_bar: BookmarkFolder;
	other: BookmarkFolder;
	synced: BookmarkFolder;
};


