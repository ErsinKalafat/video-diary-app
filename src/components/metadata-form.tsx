import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';

import { videoMetadataSchema, type VideoMetadata } from '@/db/schema';

interface MetadataFormProps {
    defaultValues?: Partial<VideoMetadata>;
    submitLabel?: string;
    isSubmitting?: boolean;
    onSubmit: (values: VideoMetadata) => void;
}

/** Shared input styling. fontSize is set inline (not via a NativeWind text-* class)
 * so no lineHeight is applied — that prevents the glyphs from being clipped on Android. */
const inputClassName =
    'rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white';
const inputTextStyle = { fontSize: 16 } as const;

/**
 * Title/description form for a diary entry, validated with zod through
 * react-hook-form. Reused for both creating and editing entries.
 */
export function MetadataForm({
    defaultValues,
    submitLabel = 'Save',
    isSubmitting = false,
    onSubmit,
}: MetadataFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<VideoMetadata>({
        resolver: zodResolver(videoMetadataSchema),
        defaultValues: {
            name: defaultValues?.name ?? '',
            description: defaultValues?.description ?? '',
        },
    });

    return (
        <View className="gap-4">
            <View className="gap-1.5">
                <Text className="text-sm font-medium text-white/80">
                    Name
                </Text>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <TextInput
                            className={inputClassName}
                            style={inputTextStyle}
                            placeholder="My morning run"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                        />
                    )}
                />
                {errors.name && (
                    <Text className="text-sm text-red-400">{errors.name.message}</Text>
                )}
            </View>

            <View className="gap-1.5">
                <Text className="text-sm font-medium text-white/80">
                    Description
                </Text>
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <TextInput
                            className={`h-28 ${inputClassName}`}
                            style={inputTextStyle}
                            placeholder="What happened in this clip?"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            multiline
                            textAlignVertical="top"
                        />
                    )}
                />
                {errors.description && (
                    <Text className="text-sm text-red-400">
                        {errors.description.message}
                    </Text>
                )}
            </View>

            <Pressable
                className="items-center rounded-2xl bg-white py-3.5 active:opacity-80 disabled:opacity-50"
                disabled={isSubmitting}
                onPress={handleSubmit(onSubmit)}
            >
                <Text className="text-base font-semibold text-indigo-700">
                    {isSubmitting ? 'Saving…' : submitLabel}
                </Text>
            </Pressable>
        </View>
    );
}
