import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { CreateView } from "@/components/refine-ui/views/create-view.tsx"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBack, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { classSchema } from "@/lib/schema";
import * as z from "zod";
import { 
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
 } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { subjects, teachers } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import UploadWidget from "@/components/cloudinary/upload-widget";
import { ControllerRenderProps } from "react-hook-form";
import { Subject, User } from "@/types";

interface CloudinaryFile {
  url: string;
  publicId: string;
}

function ClassCreate() {
    const back = useBack();
    const form = useForm({
        resolver: zodResolver(classSchema),
        refineCoreProps:{
        resource: "classes",
        action: "create"
        },
        defaultValues: {
        name: "",
        description: "",
        subjectId: 0,
        teacherId: "",
        capacity: 0,
        status: "active",
        bannerUrl: "",
        bannerCldPubId: "",
        schedules: [], 
        },
    });
    const {  refineCore: { onFinish }, handleSubmit, control, formState: { errors } } = form;
    
    const onSubmit = async (values: z.infer<typeof classSchema>) => {
        try{
            await onFinish(values);
        } catch(error){
            console.log("From error: ", error);
        }
    } 

    const { query: subjectsQuery } = useList<Subject>({
        resource: 'subjects',
        pagination: {
            pageSize: 100
        }
    });

    const { query: teacherQuery } = useList<User>({
        resource: 'users',
        filters: [
            { field: 'role', operator: 'eq', value: 'teacher' }
        ],
        pagination: {
            pageSize: 100
        }
    });

    const subjects = subjectsQuery?.data?.data || [];
    const subjectsLoading = subjectsQuery?.isLoading;

    const teachers = teacherQuery?.data?.data || [];
    const teacherLoading = teacherQuery?.isLoading;

    const bannerPublicId = form.watch('bannerCldPubId');
    const setBanner =  ( 
        file: CloudinaryFile | null ,
        field: ControllerRenderProps<z.infer<typeof classSchema>, "bannerUrl"> 
        ) => {
        if(file){
            field.onChange(file.url);
            form.setValue('bannerCldPubId', file.publicId, {
                shouldValidate: true,
                shouldDirty: true
            })
        } else{
            field.onChange("");
            form.setValue('bannerCldPubId', '', {
                shouldValidate: true,
                shouldDirty: true
            })
        }
    }
  return (
    <CreateView className="class-view">
      <Breadcrumb/>
      <h1 className="page-title">Create Class</h1>
      <p className="intro-row">
        Provide the required information to create a new class.
       <Button onClick={()=>back()}>Go back</Button>
      </p>
      <Separator />
      <div className="my-4 flex items-center">
            <Card className="class-form-card">
                <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl pb-0 font-bold">Fill up the form</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Image upload */}
                            <FormField
                            control={control}
                            name="bannerUrl"
                            render={({ field })=>(
                                <FormItem>
                                    <FormLabel>
                                        Banner Image <span className="text-orange-600">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <UploadWidget 
                                            value={field.value? 
                                                { url:field.value, publicId: bannerPublicId ?? '' }
                                                : null
                                            }
                                        onChange={(file)=>setBanner(file, field)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {errors.bannerCldPubId && !errors.bannerUrl && ( <p className="text-destructive text-sm">{errors.bannerCldPubId.message?.toString()}</p> ) }
                                </FormItem>
                            )}
                            >
                            </FormField>

                            {/* Name Form Field */}
                            <FormField
                                control={control}
                                name="name"
                                render={({ field })=>(
                                    <FormItem>
                                        <FormLabel>
                                            Class Name <span className="text-orange-600">*</span>
                                         </FormLabel>
                                        <FormControl>
                                        <Input
                                             placeholder="Introduction to Biology - Section A"
                                            {...field}
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            >
                            </FormField>
                            <div className="grid sm:grid-cols-2 items-center gap-4">
                                {/* Subject Form Field */}
                                <FormField
                                control = { control }
                                name = "subjectId"
                                render={({ field })=>(
                                        <FormItem>
                                            <FormLabel>Subject <span className="text-orange-600">*</span></FormLabel>
                                                <Select
                                                    onValueChange={(value)=> field.onChange(Number(value))}
                                                    value={field.value !== 0 ? field.value?.toString() : undefined}
                                                    disabled={subjectsLoading}
                                                >
                                                     <FormControl>
                                                        <SelectTrigger
                                                        className="w-full"
                                                        >
                                                            <SelectValue placeholder="Select a subject" />
                                                        </SelectTrigger>
                                                     </FormControl>
                                                     <SelectContent>
                                                        { subjects.map((subject)=>(
                                                            <SelectItem
                                                            value={ subject.id.toString() }
                                                            key={subject.id}
                                                            >
                                                                {subject.name}({subject.code})
                                                            </SelectItem>
                                                        )) }
                                                     </SelectContent>
                                                </Select>
                                            <FormMessage /> 
                                        </FormItem>
                                    )}
                                ></FormField>

                                {/* Teacher Form Field */}
                                <FormField
                                control={control}
                                name="teacherId"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                            Teacher <span className="text-orange-600">*</span>
                                        </FormLabel>
                                        <Select
                                            onValueChange= { field.onChange }
                                            value= { field.value?.toString() }
                                            disabled= {teacherLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Teacher" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {teachers.map((teacher) => (
                                                    <SelectItem key={teacher.id} value={teacher.id}>
                                                        {teacher.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                ></FormField>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* Capacity Form Field */}
                                <FormField
                                    control={control}
                                    name="capacity"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>
                                                Capacity <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                type="number"
                                                placeholder="30"
                                                min={1}
                                                onChange={(e)=>{
                                                    const value = e.target.value;
                                                    field.onChange(value? Number(value) : undefined)
                                                }}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                >
                                </FormField>

                                {/* Status Form Field */}
                                <FormField
                                control={control}
                                name="status"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Status <span className="text-orange-600">*</span></FormLabel>
                                        <Select
                                        onValueChange={field.onChange}
                                        value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                >
                                </FormField>
                            </div>
                            <FormField
                            control={control}
                            name="description"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea 
                                        rows={4}
                                        className="resize-none"
                                        placeholder="Brief description about the class"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            >
                            </FormField>
                            <Separator />
                        <Button type="submit" size='lg' className="w-full">
                            Submit
                        </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
      </div>
    </CreateView>
  )
}

export default ClassCreate
