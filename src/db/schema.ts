import { z } from 'zod';

/**
 * Validation schema for the metadata a user attaches to a cropped video.
 * Shared by the form (react-hook-form) and the persistence layer.
 */
export const videoMetadataSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(80, 'Title must be 80 characters or fewer'),
    description: z
        .string()
        .trim()
        .max(500, 'Description must be 500 characters or fewer'),
});

export type VideoMetadata = z.infer<typeof videoMetadataSchema>;

/** A persisted diary entry: a cropped clip plus its metadata. */
export const videoEntrySchema = videoMetadataSchema.extend({
    id: z.string(),
    uri: z.string(),
    thumbnailUri: z.string().nullable().default(null),
    durationMs: z.number().int().nonnegative(),
    createdAt: z.number().int(),
});

export type VideoEntry = z.infer<typeof videoEntrySchema>;
