"use client";

import Image from "next/image";
import {useState} from "react";
import type {ComponentProps} from "react";
import {cn} from "@/lib/utils";

type NextImageProps = ComponentProps<typeof Image>;

type SafeImageProps = NextImageProps & {
    className: string;
    imageClassName?: string;
    fallbackSrc?: string;
};

export default function SafeImage({
                                      src,
                                      fallbackSrc = "/placeholder.png",
                                      onError,
                                      ...props
                                  }: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

    return (
        <div className={cn("relative", props.className)}>
            <Image
                {...props}
                src={imgSrc}
                alt={props.alt || "no-image"}
                fill
                className={cn("object-cover", props.imageClassName)}
                onError={(e) => {
                    setImgSrc(fallbackSrc);
                    onError?.(e); // still allow custom onError if passed
                }}
            />
        </div>
    );
}
