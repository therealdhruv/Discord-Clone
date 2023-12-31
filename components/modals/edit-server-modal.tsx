"use client";

import axios from "axios";
import * as z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileUpload } from "@/components/file-upload";
import { useModal } from "@/hooks/use-modal-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField,
} from "@/components/ui/form";

const formSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Server name is required",
		})
		.max(255),
	imageURL: z.string().min(1, {
		message: "Server image is required",
	}),
});

export const EditServerModal = () => {
	const { type, isOpen, onClose, data } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "editServer";
	const { server } = data;

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			imageURL: "",
		},
	});

	useEffect(() => {
		if (server) {
			form.setValue("name", server.name);
			form.setValue("imageURL", server.imageURL);
		}
	}, [server, form]);

	const isLoading = form.formState.isSubmitting;

	const onSubmitMethod = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		try {
			await axios.patch(`/api/servers/${server?.id}`, values);
			form.reset();
			router.refresh();
			onClose();
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<>
			<Dialog open={isModalOpen} onOpenChange={handleClose}>
				<DialogContent className="bg-white text-black p-0 overflow-hidden">
					<DialogHeader className="pt-8 px-6">
						<DialogTitle className="text-2xl text-center font-bold">
							Edit your server
						</DialogTitle>
						<DialogDescription className="text-zinc-500 text-center">
							Give your server a personality by adding a name
							and an avatar. You can always change these
							later.
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmitMethod)}
							className="space-y-8"
						>
							<div className="space-y-8 px-6">
								<div className="flex items-center justify-center text-center">
									<FormField
										control={form.control}
										name="imageURL"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<FileUpload
														endpoint="serverImage"
														value={field.value}
														onChange={
															field.onChange
														}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
												Server name
											</FormLabel>
											<FormControl>
												<Input
													disabled={isLoading}
													className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
													placeholder="Enter a server name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<DialogFooter className="bg-gray-100 px-6 py-4">
								<Button
									disabled={isLoading}
									variant="primary"
								>
									Save
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};
