// src/hooks/useNominatimGeocode.ts

import axios from 'axios';
import { GeocodeResult } from '@/app/test/(components)/types';

export interface NominatimResponse extends GeocodeResult { }

export const useNominatimGeocode = (lat: number, lng: number): Promise<NominatimResponse | null> => {
    return new Promise((resolve, reject) => {
        const fetchGeocode = async () => {
            try {
                const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

                const response = await axios.get<NominatimResponse>(url);
                resolve(response.data);
            } catch (err) {
                console.error('Error fetching geocode:', err);
                reject(err instanceof Error ? err : new Error('An error occurred'));
            }
        };

        fetchGeocode();
    });
};

