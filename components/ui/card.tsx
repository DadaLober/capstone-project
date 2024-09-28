import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Card
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// Image Carousel
const CardCarousel = React.forwardRef<
  HTMLDivElement,
  {
    images: Array<{ url: string; type: string }>;
    className?: string;
    renderItem?: (file: { url: string; type: string }) => React.ReactNode;
  }
>(({ images, className, renderItem }, ref) => (
  <div ref={ref} className={cn("rounded-t-lg overflow-hidden w-full ", className)}>
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      className="h-64 custom-swiper"
    >
      {Array.isArray(images) && images.length > 0 ? images.map((file, index) => (
        <SwiperSlide key={index}>
          {renderItem ? renderItem(file) : (
            file.type === 'video' ? (
              <video
                src={file.url}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <img
                src={file.url}
                alt={`Slide ${index + 1}`}
                className="w-full rounded-lg object-cover m-auto"
              />
            )
          )}
        </SwiperSlide>
      )) : (
        <SwiperSlide>
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 font-medium">No images available</p>
          </div>
        </SwiperSlide>
      )}
    </Swiper>
  </div>
));



CardCarousel.displayName = "CardCarousel";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";


export { Card, CardCarousel, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
