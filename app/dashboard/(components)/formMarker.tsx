'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRulerCombined, FaFilePdf } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { CiVideoOn } from "react-icons/ci"
import Image from 'next/image'

import { customIcon, PropertyInfo, Location } from '@/app/dashboard/(hooks)/types'
import { Button } from "@/components/ui/button"
import { Card, CardCarousel } from "@/components/ui/card"
import Modal from '@/app/dashboard/(components)/Modal'
import "@/app/dashboard/(components)/modal.css"

// Interfaces
interface FormMarkerProps {
    location: Location
    handleOpenForm: () => void
}

interface LocationMarkerProps {
    addMarker: (position: Location) => void
}

interface PropertyMarkerProps {
    propertyInfo: PropertyInfo | null
    handleViewAdditionalProperties: () => void
}

interface FileType {
    url: string
    type: string
}

// Components
const CloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 p-1 bg-transparent rounded-full hover:bg-gray-100 transition-colors duration-200"
    >
        <IoMdClose size={20} />
    </button>
)

const FormMarker: React.FC<FormMarkerProps> = ({ location, handleOpenForm }) => {
    const map = useMap()
    const handleClosePopup = () => map.closePopup()

    return (
        <Marker position={location} icon={customIcon}>
            <Popup className="custom-popup" closeButton={false}>
                <CloseButton onClose={handleClosePopup} />
                <div className="form-marker-popup w-64 p-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{location.name || 'Unnamed Location'}</h3>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">Latitude: {location.lat}</p>
                        <p className="text-sm text-gray-500">Longitude: {location.lng}</p>
                    </div>
                    <div className="text-center">
                        <Button
                            variant="default"
                            className="mt-4 w-full"
                            onClick={handleOpenForm}
                        >
                            Add Property
                        </Button>
                    </div>
                </div>
            </Popup>
        </Marker>
    )
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ addMarker }) => {
    useMapEvents({
        click(e) {
            const newPosition = e.latlng
            addMarker(newPosition)
        },
    })
    return null
}

const PropertyMarker: React.FC<PropertyMarkerProps> = ({ propertyInfo, handleViewAdditionalProperties }) => {
    const map = useMap()
    const [files, setFiles] = useState<FileType[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const handleClosePopup = () => map.closePopup()

    useEffect(() => {
        if (propertyInfo) {
            fetchPropertyFiles(propertyInfo.id)
        }
    }, [propertyInfo])

    const fetchPropertyFiles = async (propertyId: number) => {
        try {
            const response = await axios.get(`/api/getImages?id=${propertyId}`)
            const fileUrls = Array.isArray(response.data) ? response.data : []
            setFiles(fileUrls.map((url: string) => ({
                url,
                type: url.toLowerCase().endsWith('.pdf') ? 'pdf' :
                    url.toLowerCase().endsWith('.mp4') ? 'video' : 'image'
            })))
        } catch (error) {
            console.error('Error fetching property files:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!propertyInfo) return null

    const handleFileClick = (file: FileType) => {
        setSelectedFile(file)
        setModalOpen(true)
    }

    return (
        <>
            <Marker position={[propertyInfo.location.lat, propertyInfo.location.lng]} icon={customIcon}>
                <Popup className="custom-popup" closeButton={false}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CloseButton onClose={handleClosePopup} />
                        <Card className="w-96 bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            {isLoading ? (
                                <div className="h-48 bg-gray-200 animate-pulse" />
                            ) : (
                                <CardCarousel
                                    images={files}
                                    className='h-48'
                                    renderItem={(file) => (
                                        <div onClick={() => handleFileClick(file)} className="w-full h-full">
                                            {file.type === 'pdf' ? (
                                                <div className="flex flex-col items-center justify-center h-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                                                    <FaFilePdf className="text-5xl text-red-500 mb-2" />
                                                    <span className="text-sm font-medium text-gray-700">Click to view PDF</span>
                                                </div>
                                            ) : file.type === 'video' ? (
                                                <div className="flex flex-col items-center justify-center h-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                                                    <CiVideoOn className="text-5xl text-blue-500 mb-2" />
                                                    <span className="text-sm font-medium text-gray-700">Click to play video</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 relative">
                                                    <Image
                                                        src={file.url}
                                                        alt="Property"
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />
                            )}
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-4 text-blue-600">{propertyInfo.address}</h3>
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <FaRulerCombined className="text-gray-500 mr-2" />
                                            <span>{propertyInfo.sqm} m²</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold">Price:</span>
                                        <span className="text-green-600 font-semibold">
                                            ${propertyInfo.priceHistory?.[0]?.price.toLocaleString() || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <span>Listed on:</span>
                                        <span>{new Date(propertyInfo.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <Button
                                        variant="default"
                                        className="mt-4 w-full hover:bg-gray-700 transition-colors duration-300"
                                        onClick={handleViewAdditionalProperties}
                                    >
                                        View More Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </Popup>
            </Marker>

            <AnimatePresence>
                {modalOpen && (
                    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-3xl max-h-[90vh] overflow-auto bg-transparent"
                        >
                            {selectedFile && (
                                <div className="max-w-3xl max-h-[90vh] overflow-auto">
                                    {selectedFile.type === 'pdf' ? (
                                        <embed src={selectedFile.url} type="application/pdf" width="100%" height="600px" />
                                    ) : selectedFile.type === 'video' ? (
                                        <video controls className="max-w-full max-h-[90vh]">
                                            <source src={selectedFile.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <Image
                                            src={selectedFile.url}
                                            alt="Property"
                                            width={800}
                                            height={600}
                                            style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
                                        />
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>
        </>
    )
}

export { FormMarker, LocationMarker, PropertyMarker }
