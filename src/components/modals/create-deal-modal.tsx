"use client";

import { useAppStore } from "@/client/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFormEffect } from "@/hooks/use-form-effect";
import { createDeal, updateDeal } from "@/server/modules/deal/deal.actions";
import { deleteUpload } from "@/server/modules/upload/upload.actions";
import { CocoaVariant, UserRole } from "@/types";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormButton from "../form-button";
import { Select } from "../select";
import Spinner from "../spinner";
import { Button } from "../ui/button";
import { FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { UploadDropzone } from "../upload";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

export default function CreateOrEditDealModal() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const createDealModalOpen = useAppStore((state) => state.createDealModalOpen);
  const dealToEdit = useAppStore((state) => state.dealToEdit);
  const { toggleCreateDealModal, toggleEditDealModal } = useAppStore();

  const editMode = dealToEdit !== undefined;

  const [state, action] = useFormState(editMode ? updateDeal : createDeal, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  const [loading, setLoading] = useState({ upload: false, delete: false });

  const [uploadedData, setUploadedData] = useState<
    { id: string; url: string } | undefined
  >(
    dealToEdit
      ? { id: dealToEdit.image._id, url: dealToEdit.image.url }
      : undefined
  );
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  useEffect(() => {
    if (dealToEdit) {
      // Preload form data in edit mode
      setUploadedData({ id: dealToEdit.image._id, url: dealToEdit.image.url });
    } else {
      setUploadedData(undefined);
    }
  }, [dealToEdit]);

  function toggleLoading(select: keyof typeof loading, state?: boolean) {
    setLoading((prev) => ({
      ...prev,
      [select]: state !== undefined ? state : !prev[select],
    }));
  }

  async function handleDeleteImage(fileId: string) {
    try {
      toggleLoading("delete", true);
      await deleteUpload(fileId);
      setUploadedData(undefined);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toggleLoading("delete", false);
    }
  }

  function handleCloseModal(state?: boolean) {
    if (dealToEdit) {
      toggleEditDealModal(undefined);
    } else {
      toggleCreateDealModal(state);
      selectedFile && setSelectedFile(undefined);
      uploadedData && setUploadedData(undefined);
      uploadedData &&
        deleteUpload(uploadedData.id).catch((err) =>
          console.log("Failed to delete file", err)
        );
    }
  }

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      if (dealToEdit) {
        toggleEditDealModal(undefined);
      } else {
        toggleCreateDealModal(false);
        selectedFile && setSelectedFile(undefined);
        uploadedData && setUploadedData(undefined);
      }
      toast.success(changedState.message);
      // window.location.reload();
      router.refresh();
    }
  });

  return (
    <Dialog
      open={
        user !== undefined &&
        user.role === UserRole.Farmer &&
        createDealModalOpen
      }
      onOpenChange={handleCloseModal}
    >
      <DialogTrigger hidden></DialogTrigger>

      <DialogContent className="max-w-[95dvw] rounded-md px-0 sm:max-w-lg">
        <form
          action={action}
          className="grid h-full max-h-[min(35rem,calc(100dvh-5rem))] w-full grid-rows-[auto,1fr,auto] gap-2 divide-y"
        >
          <DialogHeader className="px-5">
            <DialogTitle>
              {dealToEdit ? "Edit Deal" : "Create New Deal"}
            </DialogTitle>

            <DialogDescription>
              {dealToEdit
                ? "Edit the existing deal"
                : "Add a new deal for sale"}
            </DialogDescription>
          </DialogHeader>

          <div className="h-full w-full space-y-4 overflow-y-auto p-5">
            {dealToEdit && (
              <Input
                name="dealId"
                id="dealId"
                type="text"
                className="hidden"
                defaultValue={dealToEdit._id}
                readOnly
              />
            )}

            <FormItem>
              <FormLabel className="">Upload image</FormLabel>

              {dealToEdit ? (
                // Display existing image in edit mode without allowing changes
                <div className="relative overflow-clip rounded border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploadedData?.url}
                    alt="deal display image"
                    className="h-60 w-full overflow-clip rounded object-cover"
                  />
                </div>
              ) : uploadedData === undefined ? (
                <div className="space-y-2">
                  <UploadDropzone
                    endpoint="cocoaImageUploader"
                    onChange={(files) => {
                      files.length > 0 && setSelectedFile(files[0]);
                    }}
                    onUploadBegin={() => {
                      toggleLoading("upload", true);
                    }}
                    onClientUploadComplete={(res) => {
                      toggleLoading("upload", false);
                      setSelectedFile(undefined);

                      if (res.length > 0) {
                        const {
                          url,
                          serverData: { fileId },
                        } = res[0];

                        setUploadedData({ id: fileId, url });
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toggleLoading("upload", false);
                      toast.error(error.message);
                    }}
                    onUploadAborted={() => {
                      toggleLoading("upload", false);
                      setSelectedFile(undefined);
                    }}
                    className="p-4"
                  />

                  {selectedFile && (
                    <div className="w-full rounded border p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="deal display image"
                        className="size-14 rounded object-cover"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative overflow-clip rounded border">
                  <Button
                    variant={"destructive"}
                    className="absolute right-4 top-4 size-8 p-1"
                    onClick={() => handleDeleteImage(uploadedData.id)}
                    disabled={loading.delete}
                  >
                    {loading.delete ? (
                      <Spinner className="size-4" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploadedData.url}
                    alt="deal display image"
                    className="h-60 w-full overflow-clip rounded object-cover"
                  />
                </div>
              )}

              <Input
                name="image"
                id="image"
                type="text"
                className="hidden"
                defaultValue={uploadedData?.id ?? ""}
                readOnly
              />
            </FormItem>

            <FormItem>
              <FormLabel htmlFor="variant" className="">
                Variant
              </FormLabel>

              <Select
                name="variant"
                id="variant"
                required
                className=""
                defaultValue={dealToEdit ? dealToEdit.variant : ""}
              >
                <option value="">select variant</option>

                {Object.values(CocoaVariant).map((variant) => (
                  <option key={`option-${variant}`} value={variant}>
                    {variant}
                  </option>
                ))}
              </Select>
            </FormItem>

            <FormItem>
              <FormLabel htmlFor="quantity" className="">
                Cocoa Quantity (in bags)
              </FormLabel>
              <Input
                name="quantity"
                id="quantity"
                type="number"
                placeholder="e.g 20 bags"
                required
                defaultValue={dealToEdit ? dealToEdit.quantity : ""}
              />
            </FormItem>

            <FormItem>
              <FormLabel htmlFor="pricePerItem" className="">
                Price Per Bag
              </FormLabel>

              <Input
                name="pricePerItem"
                id="pricePerItem"
                type="number"
                placeholder="e.g 300,000"
                required
                defaultValue={dealToEdit ? dealToEdit.pricePerItem : ""}
              />
            </FormItem>

            <FormItem>
              <FormLabel htmlFor="location" className="">
                Location
              </FormLabel>

              <Input
                name="location"
                id="location"
                type="text"
                placeholder="location"
                required
                defaultValue={dealToEdit?.location ?? ""}
              />
            </FormItem>
          </div>

          <div className="px-5 pt-5">
            <FormButton
              disabled={loading.upload || loading.delete || !uploadedData}
              className="w-full bg-amber-800 hover:bg-amber-700"
            >
              {({ loading }) => {
                return loading ? (
                  <Spinner />
                ) : dealToEdit ? (
                  "Update Deal"
                ) : (
                  "Create Deal"
                );
              }}
            </FormButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
