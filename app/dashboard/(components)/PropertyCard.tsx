import React from 'react';
import { PropertyData } from './PropertyData';
import { FaGlobe, FaMapMarkerAlt, FaCompass ,FaRuler,FaDollarSign, FaPaperPlane } from 'react-icons/fa';

interface PropertyCardProps{
    data: PropertyData;
}
const PropertyCard:React.FC<PropertyCardProps> =  ({data})=>{
        return(
            <div className="bg-green-100 w-96 flex flex-col gap-4 shadow-sm rounded-sm p-4 mb-4">
                <div className='text-green-700 flex '>
                    <h2 className="text-lg w-full font-extrabold ">{data.address}</h2>
                    <FaPaperPlane size={24} className='text-blue-500'/>
                </div>
                <div className='flex gap-3'>
                    <FaGlobe size={24} className='my-auto'/>
                    <div className='block'>
                        <p> <strong>Latitude:</strong> {data.latitude}</p>
                        <p><strong>Longitude:</strong> {data.longitude}</p>
                    </div>
                </div>

                <div className='flex gap-3'>
                    <FaRuler size={24} className='my-auto'/>
                    <div className='block'>
                        <p> <strong>Size:</strong> {data.size}</p>
                    </div>
                </div>

                <div className='flex gap-3'>
                    <FaDollarSign size={24} className='my-auto'/>
                    <div className='block'>
                        <p> <strong>Price:</strong> {data.size}</p>
                    </div>
                </div>

                <div className='flex gap-3'>
                    <div className='block'>
                        <h2 className="font-semibold mt-4">Others:</h2>
                        <ul className="list-disc list-inside">
                        {data.attributes.map((attribute, index) => (
                            <li key={index}>{attribute}</li>
                        ))}
                        </ul>
                    </div>
                </div>

                <div className='flex gap-3'>
                    <div className='block'>
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
                </div>
            </div>
        );
    
}
export default PropertyCard;
    

