import React from 'react';
import { PropertyData } from './PropertyData';
import { FaGlobe, FaMapMarkerAlt, FaCompass } from 'react-icons/fa';
interface PropertyCardProps{
    data: PropertyData;
}
const PropertyCard:React.FC<PropertyCardProps> =  ({data})=>{
        return(
            <div className="bg-white w-96 shadow-lg rounded-lg p-4 mb-4">
                <h2 className="text-lg w-full font-semibold mb-2">{data.address}</h2>
                <div className='flex gap-3'>
                    <FaGlobe size={24} className='my-auto'/>
                    <div className='block'>
                        <p> <strong>Latitude:</strong> {data.latitude}</p>
                        <p><strong>Longitude:</strong> {data.longitude}</p>
                    </div>
                </div>
                <p><strong>Size:</strong> {data.size}</p>
                <p><strong>Price:</strong> {data.price}</p>
                <h3 className="font-semibold mt-4">Attributes:</h3>
                <ul className="list-disc list-inside">
                {data.attributes.map((attribute, index) => (
                    <li key={index}>{attribute}</li>
                ))}
                </ul>
                <h3 className="font-semibold mt-4">Uploaded Files:</h3>
                <div className="grid grid-cols-2 gap-2">
                {data.files.map((file, index) => (
                    <div key={index} className="relative">
                    <img
                        src={URL.createObjectURL(file)}
                        alt={`File preview ${index}`}
                        className="w-full h-auto object-cover rounded"
                    />
                    </div>
                ))}
                </div>
            </div>
        );
    
}
export default PropertyCard;
    

