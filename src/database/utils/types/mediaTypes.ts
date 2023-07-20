export type MediaType = {
    name: string;
    type: number;
}

export const document: MediaType = {
    name: 'document',
    type: 1
}

export const audio: MediaType = {
    name: 'audio',
    type: 2
}

export const video: MediaType = {
    name: 'video',
    type: 3
}

export const mediaTypes = [document, audio, video]