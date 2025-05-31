import { useRef, useEffect } from "react";

export function usePrev(currVal: unknown) {
    const ref = useRef<unknown>(undefined)
    useEffect(() => { ref.current = currVal }, [ currVal ])
    return ref.current
}
