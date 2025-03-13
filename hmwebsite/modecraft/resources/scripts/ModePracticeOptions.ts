type ModeData = {
	index: number,
	tonic: string,
	mode: string,
	startTime: number,
	videoId: string,
	volume: number,
	isBlank: boolean
}
class ModePracticeOptions {
	data: ModeData[]
	player: YTPlayer
}