"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  CornerDownLeftIcon,
  ImageIcon,
  Loader2Icon,
  MicIcon,
  PaperclipIcon,
  PlusIcon,
  SquareIcon,
  XIcon,
} from "lucide-react";
import { nanoid } from "nanoid";
import {
  type ChangeEvent,
  type ChangeEventHandler,
  Children,
  type ClipboardEventHandler,
  type ComponentProps,
  createContext,
  type FormEvent,
  type FormEventHandler,
  Fragment,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Types
export type ChatStatus = "ready" | "submitted" | "streaming" | "error";

export interface FileUIPart {
  type: "file";
  url: string;
  mediaType: string;
  filename?: string;
}

export interface PromptInputMessage {
  text: string;
  files: FileUIPart[];
}

// Context types
type ProviderAttachmentsContextType = {
  files: (FileUIPart & { id: string })[];
  add: (files: File[] | FileList) => void;
  remove: (id: string) => void;
  clear: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  openRef: RefObject<() => void>;
};

type PromptInputControllerContextType = {
  textInput: {
    value: string;
    setInput: (v: string) => void;
    clear: () => void;
  };
  attachments: ProviderAttachmentsContextType;
};

const PromptInputController =
  createContext<PromptInputControllerContextType | null>(null);

const ProviderAttachmentsContext =
  createContext<ProviderAttachmentsContextType | null>(null);

const LocalAttachmentsContext =
  createContext<ProviderAttachmentsContextType | null>(null);

const useOptionalPromptInputController = () =>
  useContext(PromptInputController);

export const useProviderAttachments = () => {
  const ctx = useContext(ProviderAttachmentsContext);
  if (!ctx) {
    throw new Error(
      "Wrap your component inside PromptInputProvider to use useProviderAttachments()"
    );
  }
  return ctx;
};

const useOptionalProviderAttachments = () =>
  useContext(ProviderAttachmentsContext);

export type PromptInputProviderProps = PropsWithChildren<{
  initialInput?: string;
}>;

export function PromptInputProvider({
  initialInput: initialTextInput = "",
  children,
}: PromptInputProviderProps) {
  const [textInput, setTextInput] = useState(initialTextInput);
  const clearInput = useCallback(() => setTextInput(""), []);

  const [attachmentFiles, setAttachmentFiles] = useState<
    (FileUIPart & { id: string })[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef<() => void>(() => {});

  const add = useCallback((files: File[] | FileList) => {
    const incoming = Array.from(files);
    if (incoming.length === 0) return;

    setAttachmentFiles((prev) =>
      prev.concat(
        incoming.map((file) => ({
          id: nanoid(),
          type: "file" as const,
          url: URL.createObjectURL(file),
          mediaType: file.type,
          filename: file.name,
        }))
      )
    );
  }, []);

  const remove = useCallback((id: string) => {
    setAttachmentFiles((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found?.url) {
        URL.revokeObjectURL(found.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setAttachmentFiles((prev) => {
      for (const f of prev) {
        if (f.url) {
          URL.revokeObjectURL(f.url);
        }
      }
      return [];
    });
  }, []);

  const attachmentsCtx: ProviderAttachmentsContextType = useMemo(
    () => ({
      files: attachmentFiles,
      add,
      remove,
      clear,
      fileInputRef,
      openRef,
    }),
    [attachmentFiles, add, remove, clear]
  );

  const controllerCtx: PromptInputControllerContextType = useMemo(
    () => ({
      textInput: {
        value: textInput,
        setInput: setTextInput,
        clear: clearInput,
      },
      attachments: attachmentsCtx,
    }),
    [textInput, clearInput, attachmentsCtx]
  );

  return (
    <PromptInputController.Provider value={controllerCtx}>
      <ProviderAttachmentsContext.Provider value={attachmentsCtx}>
        {children}
      </ProviderAttachmentsContext.Provider>
    </PromptInputController.Provider>
  );
}

// Main PromptInput component
export type PromptInputProps = Omit<
  ComponentProps<"form">,
  "onSubmit"
> & {
  accept?: string;
  multiple?: boolean;
  globalDrop?: boolean;
  syncHiddenInput?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  onError?: (err: {
    code: "max_files" | "max_file_size" | "accept";
    message: string;
  }) => void;
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
};

export const PromptInput = ({
  className,
  accept,
  multiple,
  globalDrop,
  syncHiddenInput,
  maxFiles,
  maxFileSize,
  onError,
  onSubmit,
  children,
  ...props
}: PromptInputProps) => {
  const controller = useOptionalPromptInputController();
  const usingProvider = !!controller;

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [items, setItems] = useState<(FileUIPart & { id: string })[]>([]);
  const files = usingProvider ? controller.attachments.files : items;

  const filesRef = useRef(files);
  filesRef.current = files;

  const openFileDialogLocal = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const matchesAccept = useCallback(
    (f: File) => {
      if (!accept || accept.trim() === "") return true;

      const patterns = accept
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      return patterns.some((pattern) => {
        if (pattern.endsWith("/*")) {
          const prefix = pattern.slice(0, -1);
          return f.type.startsWith(prefix);
        }
        return f.type === pattern;
      });
    },
    [accept]
  );

  const addLocal = useCallback(
    (fileList: File[] | FileList) => {
      const incoming = Array.from(fileList);
      const accepted = incoming.filter((f) => matchesAccept(f));
      if (incoming.length && accepted.length === 0) {
        onError?.({
          code: "accept",
          message: "No files match the accepted types.",
        });
        return;
      }
      const withinSize = (f: File) =>
        maxFileSize ? f.size <= maxFileSize : true;
      const sized = accepted.filter(withinSize);
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: "max_file_size",
          message: "All files exceed the maximum size.",
        });
        return;
      }

      setItems((prev) => {
        const capacity =
          typeof maxFiles === "number" ? maxFiles - prev.length : Infinity;
        const toAdd = sized.slice(0, capacity);

        if (toAdd.length < sized.length) {
          onError?.({
            code: "max_files",
            message: `Maximum ${maxFiles} files allowed.`,
          });
        }

        return prev.concat(
          toAdd.map((file) => ({
            id: nanoid(),
            type: "file" as const,
            url: URL.createObjectURL(file),
            mediaType: file.type,
            filename: file.name,
          }))
        );
      });
    },
    [matchesAccept, maxFiles, maxFileSize, onError]
  );

  const removeLocal = useCallback((id: string) => {
    setItems((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found?.url) {
        URL.revokeObjectURL(found.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearLocal = useCallback(() => {
    setItems((prev) => {
      for (const f of prev) {
        if (f.url) {
          URL.revokeObjectURL(f.url);
        }
      }
      return [];
    });
  }, []);

  const add = usingProvider ? controller.attachments.add : addLocal;
  const remove = usingProvider ? controller.attachments.remove : removeLocal;
  const clear = usingProvider ? controller.attachments.clear : clearLocal;

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      add(e.target.files);
    }
    e.target.value = "";
  };

  const localCtx: ProviderAttachmentsContextType = useMemo(
    () => ({
      files: items,
      add: addLocal,
      remove: removeLocal,
      clear: clearLocal,
      fileInputRef: inputRef,
      openRef: { current: openFileDialogLocal },
    }),
    [items, addLocal, removeLocal, clearLocal, openFileDialogLocal]
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const text = (fd.get("prompt") as string) || "";

    const convertedFiles: FileUIPart[] = files.map((item) => ({
      type: "file" as const,
      url: item.url,
      mediaType: item.mediaType,
      filename: item.filename,
    }));

    try {
      const result = onSubmit({ text, files: convertedFiles }, event);

      if (result instanceof Promise) {
        result
          .then(() => {
            clear();
            if (usingProvider) {
              controller.textInput.clear();
            }
          })
          .catch(() => {});
      } else {
        clear();
        if (usingProvider) {
          controller.textInput.clear();
        }
      }
    } catch {
      // Don't clear on error
    }
  };

  const inner = (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      <form ref={formRef} onSubmit={handleSubmit} className={className} {...props}>
        {children}
      </form>
    </>
  );

  return usingProvider ? (
    inner
  ) : (
    <LocalAttachmentsContext.Provider value={localCtx}>
      {inner}
    </LocalAttachmentsContext.Provider>
  );
};

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputBody = ({
  className,
  ...props
}: PromptInputBodyProps) => (
  <InputGroup className={cn("flex-col gap-0", className)} {...props} />
);

export type PromptInputTextareaProps = ComponentProps<
  typeof InputGroupTextarea
>;

export const PromptInputTextarea = ({
  onChange,
  className,
  placeholder = "What would you like to know?",
  ...props
}: PromptInputTextareaProps) => {
  const controller = useOptionalPromptInputController();
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const controlledProps = controller
    ? {
        value: controller.textInput.value,
        onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
          controller.textInput.setInput(e.currentTarget.value);
          onChange?.(e);
        },
      }
    : { onChange };

  return (
    <InputGroupTextarea
      className={cn("min-h-[44px] resize-none", className)}
      name="prompt"
      onCompositionEnd={() => setIsComposing(false)}
      onCompositionStart={() => setIsComposing(true)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...props}
      {...controlledProps}
    />
  );
};

export type PromptInputHeaderProps = Omit<
  ComponentProps<typeof InputGroupAddon>,
  "align"
>;

export const PromptInputHeader = ({
  className,
  ...props
}: PromptInputHeaderProps) => (
  <InputGroupAddon align="left" className={cn("border-0 border-b", className)} {...props} />
);

export type PromptInputFooterProps = Omit<
  ComponentProps<typeof InputGroupAddon>,
  "align"
>;

export const PromptInputFooter = ({
  className,
  ...props
}: PromptInputFooterProps) => (
  <InputGroupAddon align="right" className={cn("border-0 border-t", className)} {...props} />
);

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTools = ({
  className,
  ...props
}: PromptInputToolsProps) => (
  <InputGroupButton className={cn("gap-1", className)} {...props} />
);

export type PromptInputButtonProps = ComponentProps<typeof Button>;

export const PromptInputButton = ({
  variant = "ghost",
  className,
  size,
  ...props
}: PromptInputButtonProps) => {
  const newSize = size ?? (Children.count(props.children) > 1 ? "sm" : "icon");

  return (
    <Button
      className={cn("shrink-0", className)}
      size={newSize}
      type="button"
      variant={variant}
      {...props}
    />
  );
};

export type PromptInputActionMenuProps = ComponentProps<typeof DropdownMenu>;
export const PromptInputActionMenu = (props: PromptInputActionMenuProps) => (
  <DropdownMenu {...props} />
);

export type PromptInputActionMenuTriggerProps = PromptInputButtonProps;

export const PromptInputActionMenuTrigger = ({
  className,
  children,
  ...props
}: PromptInputActionMenuTriggerProps) => (
  <DropdownMenuTrigger asChild>
    <PromptInputButton className={className} {...props}>
      {children ?? <PlusIcon className="h-4 w-4" />}
    </PromptInputButton>
  </DropdownMenuTrigger>
);

export type PromptInputActionMenuContentProps = ComponentProps<
  typeof DropdownMenuContent
>;
export const PromptInputActionMenuContent = ({
  className,
  ...props
}: PromptInputActionMenuContentProps) => (
  <DropdownMenuContent className={cn("min-w-48", className)} {...props} />
);

export type PromptInputActionMenuItemProps = ComponentProps<
  typeof DropdownMenuItem
>;
export const PromptInputActionMenuItem = ({
  className,
  ...props
}: PromptInputActionMenuItemProps) => (
  <DropdownMenuItem className={cn("gap-2", className)} {...props} />
);

export type PromptInputSubmitProps = ComponentProps<typeof Button> & {
  status?: ChatStatus;
};

export const PromptInputSubmit = ({
  className,
  variant = "default",
  size = "icon",
  status,
  children,
  ...props
}: PromptInputSubmitProps) => {
  let Icon = <CornerDownLeftIcon className="h-4 w-4" />;

  if (status === "submitted") {
    Icon = <Loader2Icon className="h-4 w-4 animate-spin" />;
  } else if (status === "streaming") {
    Icon = <SquareIcon className="h-4 w-4" />;
  } else if (status === "error") {
    Icon = <CornerDownLeftIcon className="h-4 w-4" />;
  }

  return (
    <Button
      className={cn("shrink-0", className)}
      size={size}
      type="submit"
      variant={variant}
      {...props}
    >
      {children ?? Icon}
    </Button>
  );
};

export type PromptInputAttachButtonProps = PromptInputButtonProps;

export const PromptInputAttachButton = ({
  children,
  ...props
}: PromptInputAttachButtonProps) => {
  const providerAttachments = useOptionalProviderAttachments();
  const localAttachments = useContext(LocalAttachmentsContext);
  const attachments = providerAttachments || localAttachments;

  const handleClick = () => {
    if (attachments?.fileInputRef.current) {
      attachments.fileInputRef.current.click();
    } else {
      attachments?.openRef.current?.();
    }
  };

  return (
    <PromptInputButton onClick={handleClick} {...props}>
      {children ?? <PaperclipIcon className="h-4 w-4" />}
    </PromptInputButton>
  );
};

export type PromptInputSpeechToTextProps = PromptInputButtonProps & {
  onTranscriptionChange?: (text: string) => void;
};

export const PromptInputSpeechToText = ({
  onTranscriptionChange,
  children,
  ...props
}: PromptInputSpeechToTextProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const controller = useOptionalPromptInputController();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const speechRecognition = new SpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;

      speechRecognition.onstart = () => {
        setIsListening(true);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const current = controller?.textInput.value ?? textareaRef.current?.value ?? "";
        const newValue = current ? `${current} ${transcript}` : transcript;

        if (controller) {
          controller.textInput.setInput(newValue);
        } else if (textareaRef.current) {
          textareaRef.current.value = newValue;
        }
        onTranscriptionChange?.(newValue);
      };

      speechRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = speechRecognition;
      setRecognition(speechRecognition);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [controller, onTranscriptionChange]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }, [recognition, isListening]);

  return (
    <PromptInputButton
      onClick={toggleListening}
      className={cn(isListening && "text-destructive")}
      {...props}
    >
      {children ?? <MicIcon className="h-4 w-4" />}
    </PromptInputButton>
  );
};

// Attachments display
export type PromptInputAttachmentsProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputAttachments = ({
  className,
  ...props
}: PromptInputAttachmentsProps) => {
  const providerAttachments = useOptionalProviderAttachments();
  const localAttachments = useContext(LocalAttachmentsContext);
  const attachments = providerAttachments || localAttachments;

  if (!attachments?.files.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2 p-2", className)} {...props}>
      {attachments.files.map((file) => (
        <PromptInputAttachmentItem
          key={file.id}
          file={file}
          onRemove={() => attachments.remove(file.id)}
        />
      ))}
    </div>
  );
};

type PromptInputAttachmentItemProps = {
  file: FileUIPart & { id: string };
  onRemove: () => void;
};

const PromptInputAttachmentItem = ({
  file,
  onRemove,
}: PromptInputAttachmentItemProps) => {
  const isImage = file.mediaType?.startsWith("image/");

  return (
    <div className="relative group">
      {isImage ? (
        <img
          src={file.url}
          alt={file.filename || "Attachment"}
          className="h-16 w-16 rounded-md object-cover border"
        />
      ) : (
        <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
          <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm truncate max-w-[120px]">
            {file.filename || "Attachment"}
          </span>
        </div>
      )}
      <Button
        className="absolute -right-1 -top-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
        size="icon"
        type="button"
        variant="destructive"
      >
        <XIcon className="h-3 w-3" />
      </Button>
    </div>
  );
};

// Select components for model selection
export type PromptInputSelectProps = ComponentProps<typeof Select>;

export const PromptInputSelect = (props: PromptInputSelectProps) => (
  <Select {...props} />
);

export type PromptInputSelectTriggerProps = ComponentProps<typeof SelectTrigger>;

export const PromptInputSelectTrigger = ({
  className,
  ...props
}: PromptInputSelectTriggerProps) => (
  <SelectTrigger className={cn("h-8 w-auto min-w-32", className)} {...props} />
);

export type PromptInputSelectContentProps = ComponentProps<typeof SelectContent>;

export const PromptInputSelectContent = ({
  className,
  ...props
}: PromptInputSelectContentProps) => (
  <SelectContent className={className} {...props} />
);

export type PromptInputSelectItemProps = ComponentProps<typeof SelectItem>;

export const PromptInputSelectItem = ({
  className,
  ...props
}: PromptInputSelectItemProps) => (
  <SelectItem className={className} {...props} />
);

export type PromptInputSelectValueProps = ComponentProps<typeof SelectValue>;

export const PromptInputSelectValue = ({
  className,
  ...props
}: PromptInputSelectValueProps) => (
  <SelectValue className={className} {...props} />
);

// HoverCard components
export type PromptInputHoverCardProps = ComponentProps<typeof HoverCard>;

export const PromptInputHoverCard = ({
  openDelay = 0,
  closeDelay = 0,
  ...props
}: PromptInputHoverCardProps) => (
  <HoverCard openDelay={openDelay} closeDelay={closeDelay} {...props} />
);

export type PromptInputHoverCardTriggerProps = ComponentProps<typeof HoverCardTrigger>;

export const PromptInputHoverCardTrigger = (
  props: PromptInputHoverCardTriggerProps
) => <HoverCardTrigger {...props} />;

export type PromptInputHoverCardContentProps = ComponentProps<typeof HoverCardContent>;

export const PromptInputHoverCardContent = ({
  align = "start",
  ...props
}: PromptInputHoverCardContentProps) => (
  <HoverCardContent align={align} {...props} />
);

// Add global types for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
