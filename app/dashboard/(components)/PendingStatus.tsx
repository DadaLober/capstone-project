'use client';

import React from 'react';

const PendingStatusScreen = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-card rounded-xl shadow-lg p-8">
                <div className="flex flex-col items-center space-y-6">
                    <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-black/5">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 object-contain"
                        >
                            <source src="/pending-animation.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold text-foreground">
                            Account Pending Approval
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-md">
                            Your account is currently under review. Our team will verify your information and activate your account soon.
                        </p>
                    </div>

                    <div className="w-full bg-muted rounded-lg p-6">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <p className="text-sm text-muted-foreground">
                                Verification typically takes 24-48 hours. You'll receive an email once your account is approved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingStatusScreen;