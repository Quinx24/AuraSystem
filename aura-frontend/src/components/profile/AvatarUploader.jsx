import { useRef, useState, useEffect } from "react";
import { FiCamera } from "react-icons/fi";
import { uploadImage } from "../../services/uploadService";

export default function AvatarUploader({
    avatarUrl,
    onUploaded,
    size = "w-36 h-36",
    border = "border-4 border-white",
}) {

    const fileInputRef = useRef(null);

    const [preview, setPreview] = useState(avatarUrl);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setPreview(avatarUrl);
    }, [avatarUrl]);

    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleChooseFile = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        setPreview(previewUrl);

        try {

            setUploading(true);

            const uploadedAvatarUrl = await uploadImage(file);

            onUploaded(uploadedAvatarUrl);

        } catch (error) {

            console.error(error);

            setPreview(avatarUrl);

        } finally {

            setUploading(false);

        }

    };

    const imageUrl = preview
        ? preview.startsWith("blob:")
            ? preview
            : `${import.meta.env.VITE_API_URL}${preview}`
        : "https://i.pravatar.cc/300";

    return (
        <div className="relative w-fit">

            <img
                src={imageUrl}
                className={`${size} rounded-full object-cover ${border}`}
                alt="Avatar"
            />

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleChooseFile}
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                    absolute
                    bottom-1
                    right-1
                    w-10
                    h-10
                    rounded-full
                    bg-white
                    shadow-lg
                    flex
                    items-center
                    justify-center
                    text-violet-600
                "
            >
                <FiCamera />
            </button>

        </div>
    );
}