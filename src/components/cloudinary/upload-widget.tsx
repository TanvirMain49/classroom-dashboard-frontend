/* eslint-disable @typescript-eslint/no-unused-vars */
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { UploadWidgetValue } from "@/types";
import { UploadCloudIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react"

interface UploadWidgetProps {
    value?: UploadWidgetValue | null,
    onChange: (file: UploadWidgetValue | null, field?: any) => void;
    disabled?: boolean
}

const UploadWidget = ({value= null, onChange, disabled = false}: UploadWidgetProps) => {
    const widgetRef = useRef<CloudinaryWidget | null>(null);
    const onChangeRef = useRef(onChange);
    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);


    useEffect(()=>{
        setPreview(value);
    }, [value])

    useEffect(()=>{
        onChangeRef.current = onChange;
    }, [onChange])

    useEffect(()=>{
        if(typeof window === 'undefined') return;

        const initializeWidget = () =>{
            if(!window.cloudinary || widgetRef.current) return;
            widgetRef.current = window.cloudinary.createUploadWidget({
                cloudName: CLOUDINARY_CLOUD_NAME,
                uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                multiple: false,
                folder:'upload',
                maxFileSize: 5000000,
                clientAllowFormats: ['jpg', 'png', 'jpeg', 'webp']
            }, (error, result)=>{
                if(!error && result.event === 'success'){
                    console.log("initializeWidget result: ", result);
                    const payload: UploadWidgetValue = {
                        url : result.info.secure_url,
                        publicId: result.info.public_id,
                    }
                    setPreview(payload);
                    onChangeRef.current?.(payload);
                }
            });
            return true;
        }
        if(initializeWidget()) return;
        
        const intervalId = window.setInterval(()=> {
            if(initializeWidget()){
                window.clearInterval(intervalId);
            }
        }, 500)

        return () => window.clearInterval(intervalId);
    }, [])

    const openWidget = ()=>{
        if(!disabled) widgetRef.current?.open();
    }
  return (
    <div>
      { preview?
      (
        <div className="upload-preview">
            <img src={preview.url} alt="Upload file" />
        </div>
      ): <div 
        className="upload-dropzone"
        role="button"
        tabIndex={0}
        onClick={openWidget}
        onKeyDown={(event) =>{
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openWidget();
            }
        }}    
        >
            <UploadCloudIcon className="icon"/>
            <div>
                <p className="text-md">Click to upload photo</p>
                <p className="text-sm">PNG, JPG up to 5MB</p>
            </div>

      </div> 
      
    }
    </div>
  )
}

export default UploadWidget
