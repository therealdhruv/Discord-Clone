"use client";

import React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import ActionTooltip from "@/components/action-tooltip";

interface NavigationItemProps {
	id: string;
	imageURL: string;
	name: string;
}

export const NavigationItem = (props: NavigationItemProps) => {
	const params = useParams();
	const router = useRouter();
	const onClickMethod = () => {
		router.push(`/servers/${props.id}`);
	};
	return (
		<ActionTooltip side="right" align="center" label={props.name}>
			<button
				onClick={onClickMethod}
				className="group realtive flex items-center"
			>
				<div
					className={cn(
						"absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
						params?.serverId !== props.id && "group-hover:h-[20px]",
						params?.serverId === props.id ? "h-[36px]" : "h-[8px]"
					)}
				/>
				<div
					className={cn(
						"relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
						params?.serverId === props.id && "bg-primary/10 text-primary rounded-[16px]"
					)}
				>
					<Image fill src={props.imageURL} alt="Channel" />
				</div>
			</button>
		</ActionTooltip>
	);
};
