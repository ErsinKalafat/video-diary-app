import { z } from 'zod';

/**
 * Validation schema for the metadata a user attaches to a cropped video.
 * Shared by the form (react-hook-form) and the persistence layer.
 */
export const videoMetadataSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be 100 characters or fewer'),
    description: z
        .string()
        .trim()
        .max(200, 'Description must be 200 characters or fewer'),
});

export type VideoMetadata = z.infer<typeof videoMetadataSchema>;

/** A persisted diary entry: a cropped clip plus its metadata. */
export const videoEntrySchema = videoMetadataSchema.extend({
    id: z.string(),
    /** URI of the original source video the clip was cropped from. */
    originalUri: z.string(),
    /** URI of the cropped 5-second clip stored on the device. */
    croppedUri: z.string(),
    createdAt: z.number().int(),
});

export type VideoEntry = z.infer<typeof videoEntrySchema>;
