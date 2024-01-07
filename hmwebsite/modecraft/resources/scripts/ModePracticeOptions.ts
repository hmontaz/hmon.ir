type ModeData = {
	index: number,
	tonic: string,
	mode: string,
	startTime: number,
	videoId: string,
	volume: number
}
class ModePracticeOptions {
	data: ModeData[]
	player: YTPlayer
}