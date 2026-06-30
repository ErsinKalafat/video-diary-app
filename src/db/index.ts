export { getDatabase } from './database';
export {
    deleteVideo,
    getVideo,
    insertVideo,
    listVideos,
    updateVideoMetadata,
} from './video-queries';
export {
    videoEntrySchema,
    videoMetadataSchema,
    type VideoEntry,
    type VideoMetadata,
} from './schema';
