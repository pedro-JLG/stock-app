import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';

// GET helper. Pass null as path to skip the request.
// reload() refetches silently: `loading` is only true while the path changes.
export function useFetch(path) {
    const [state, setState] = useState({ path: null, data: null, error: null });
    const [tick, setTick] = useState(0);

    useEffect(() => {
        if (!path) {
            return;
        }
        let ignore = false;

        api(path)
            .then((data) => {
                if (!ignore) {
                    setState({ path, data, error: null });
                }
            })
            .catch((error) => {
                if (!ignore) {
                    setState((prev) => ({
                        path,
                        data: prev.path === path ? prev.data : null,
                        error,
                    }));
                }
            });

        return () => {
            ignore = true;
        };
    }, [path, tick]);

    const reload = useCallback(() => setTick((t) => t + 1), []);

    const current = state.path === path;
    return {
        data: current ? state.data : null,
        error: current ? state.error : null,
        loading: path !== null && !current,
        reload,
    };
}
