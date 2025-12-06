'use client';

import { supabase } from "@/utilities/supabaseClient";
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function RichTextEditor({ value, onChange, placeholder }) {
	const [mounted, setMounted] = useState(false);
	const [htmlMode, setHtmlMode] = useState(false);
	const quillRef = useRef(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	const imageHandler = () => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = async () => {
			const file = input.files[0];
			if (!file) return;

			const { error } = await supabase.storage
				.from("images")
				.upload(file.name, file, {
					cacheControl: "3600",
					upsert: true,
				});

			if (error) {
				console.error("Upload failed:", error);
				return;
			}

			const { data } = supabase.storage
				.from("images")
				.getPublicUrl(file.name);

			const publicUrl = data.publicUrl;
			const quill = quillRef.current.getEditor();
			const range = quill.getSelection(true);

			quill.insertEmbed(range.index, "image", publicUrl, "user");
			quill.setSelection(range.index + 1);
		};
	};

	const modules = {
		toolbar: {
			container: [
				[{ header: [2, 3, false] }],
				["bold", "italic", "underline", "strike"],
				[{ color: [] }],
				[{ align: [] }],
				[{ list: "ordered" }, { list: "bullet" }],
				["blockquote", "code-block"],
				["link", "image"],
				["clean"],
			],
			handlers: { image: imageHandler },
		},
	};

	const formats = [
		'header',
		'bold', 'italic', 'underline', 'strike',
		"color",
		'align',
		'list',
		'blockquote', 'code-block',
		'link', 'image'
	];

	if (!mounted) {
		return (
			<div className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-md px-4 py-3 min-h-[200px]">
				Loading editor...
			</div>
		);
	}

	return (
		<div className="rich-text-editor flex flex-col">

			{/* Tabs */}
			<div className="flex border-b border-zinc-700 mb-1">
				<button
					type="button"
					onClick={() => setHtmlMode(false)}
					className={`px-4 py-2 text-sm ${
						!htmlMode
							? "text-white border-b-2 border-red-500"
							: "text-zinc-400"
					}`}
				>
					Visual
				</button>

				<button
					type="button"
					onClick={() => setHtmlMode(true)}
					className={`px-4 py-2 text-sm ${
						htmlMode
							? "text-white border-b-2 border-red-500"
							: "text-zinc-400"
					}`}
				>
					HTML
				</button>
			</div>

			{/* HTML MODE */}
			{htmlMode ? (
				<textarea
					className="w-full min-h-[200px] bg-zinc-900 border border-neutral-800 rounded-md p-3 text-white text-sm"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			) : (
				<ReactQuill
					ref={quillRef}
					theme="snow"
					value={value}
					onChange={onChange}
					modules={modules}
					formats={formats}
					placeholder={placeholder}
					className="bg-zinc-900 border border-neutral-800 rounded-md p-2 text-white text-lg"
				/>
			)}

			<style jsx global>{`
				.rich-text-editor .ql-toolbar {
					background: #27272a;
					border: 1px solid #3f3f46;
					border-bottom: none;
					border-top-left-radius: 0.375rem;
					border-top-right-radius: 0.375rem;
				}

				.rich-text-editor .ql-container {
					background: #27272a;
					border: 1px solid #3f3f46;
					border-bottom-left-radius: 0.375rem;
					border-bottom-right-radius: 0.375rem;
					color: #f4f4f5;
					min-height: 200px;
				}

				.rich-text-editor .ql-editor {
					min-height: 200px;
					color: #f4f4f5;
				}

				.rich-text-editor .ql-editor.ql-blank::before {
					color: #71717a;
				}

				.rich-text-editor .ql-stroke {
					stroke: #a1a1aa;
				}

				.rich-text-editor .ql-fill {
					fill: #a1a1aa;
				}

				.rich-text-editor .ql-picker-label {
					color: #a1a1aa;
				}

				.rich-text-editor .ql-toolbar button:hover,
				.rich-text-editor .ql-toolbar button:focus,
				.rich-text-editor .ql-toolbar button.ql-active {
					color: #10b981;
				}

				.rich-text-editor .ql-toolbar button:hover .ql-stroke,
				.rich-text-editor .ql-toolbar button:focus .ql-stroke,
				.rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
					stroke: #10b981;
				}

				.rich-text-editor .ql-toolbar button:hover .ql-fill,
				.rich-text-editor .ql-toolbar button:focus .ql-fill,
				.rich-text-editor .ql-toolbar button.ql-active .ql-fill {
					fill: #10b981;
				}

				.rich-text-editor .ql-picker-options {
					background: #27272a;
					border: 1px solid #3f3f46;
				}

				.rich-text-editor .ql-picker-item {
					color: #a1a1aa;
				}

				.rich-text-editor .ql-picker-item:hover {
					color: #10b981;
				}

				.rich-text-editor .ql-editor h1,
				.rich-text-editor .ql-editor h2,
				.rich-text-editor .ql-editor h3 {
					color: #f4f4f5;
					font-weight: 700;
				}

				.rich-text-editor .ql-editor a {
					color: #10b981;
				}

				.rich-text-editor .ql-editor blockquote {
					border-left: 4px solid #3f3f46;
					color: #a1a1aa;
				}

				.rich-text-editor .ql-editor code,
				.rich-text-editor .ql-editor pre {
					background: #18181b;
					color: #10b981;
				}
			`}</style>
		</div>
	);
}
