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

    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);

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

        } catch {
            setPreview("");

        } finally {

            setUploading(false);

        }

    };

    const currentAvatar = preview || avatarUrl;

    const imageUrl = currentAvatar
        ? currentAvatar.startsWith("blob:")
            ? currentAvatar
            : `${import.meta.env.VITE_API_URL}${currentAvatar}`
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
                disabled={uploading}
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
                    disabled:opacity-60
                "
            >
                <FiCamera />
            </button>

        </div>
    );
}
