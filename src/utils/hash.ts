const HASH_CHUNK_SIZE = 65536; // 64 * 1024

function process(chunk: string): number[] {
    const longs = new Array(8).fill(0);
    for (let i = 0; i < chunk.length; i++) {
        longs[(i + 8) % 8] += chunk.charCodeAt(i);
    }
    return longs;
}

function binl2hex(a: number[]): string {
    const b = 255;
    const d = '0123456789abcdef';
    let e = '';
    let c = 7;

    a[1] += a[0] >> 8;
    a[0] = a[0] & b;
    a[2] += a[1] >> 8;
    a[1] = a[1] & b;
    a[3] += a[2] >> 8;
    a[2] = a[2] & b;
    a[4] += a[3] >> 8;
    a[3] = a[3] & b;
    a[5] += a[4] >> 8;
    a[4] = a[4] & b;
    a[6] += a[5] >> 8;
    a[5] = a[5] & b;
    a[7] += a[6] >> 8;
    a[6] = a[6] & b;
    a[7] = a[7] & b;
    for (; c > -1; c--) {
        e += d.charAt(a[c] >> 4 & 15) + d.charAt(a[c] & 15);
    }
    return e;
}

function readChunk(file: File, start: number, end?: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target?.result as string);
        };
        reader.onerror = reject;
        if (end === undefined) {
            reader.readAsBinaryString(file.slice(start));
        } else {
            reader.readAsBinaryString(file.slice(start, end));
        }
    });
}

export async function calculateHash(file: File): Promise<string> {
    const longs = new Array(8).fill(0);
    let temp = file.size;

    // Initialize longs array with file size
    for (let i = 0; i < 8; i++) {
        longs[i] = temp & 255;
        temp = temp >> 8;
    }

    // Read first chunk
    const firstChunk = await readChunk(file, 0, HASH_CHUNK_SIZE);
    const firstLongs = process(firstChunk);

    // Read last chunk
    const lastChunk = await readChunk(file, file.size - HASH_CHUNK_SIZE);
    const lastLongs = process(lastChunk);

    // Combine the results
    for (let i = 0; i < 8; i++) {
        longs[i] += firstLongs[i] + lastLongs[i];
    }

    return binl2hex(longs);
}
