import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ComprehensiveStudentForm, { 
  ComprehensiveStudentFormData 
} from "@/components/forms/ComprehensiveStudentForm";
import { supabase } from "@/integrations/supabase/client";

type AuthUser = ReturnType<typeof useAuth>['user'];

// Define the student data type that matches the database schema
interface StudentDB {
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  university_id: number;
  course_id: number;
  academic_session_id: number;
  status: string;
  agent_id?: number;
  admission_number?: string;
  city?: string;
  country?: string;
  address?: string;
  aadhaar_number?: string;
  passport_number?: string;
  scores?: string;
  twelfth_marks?: number;
  photo_url?: string;
  passport_copy_url?: string;
  aadhaar_copy_url?: string;
  twelfth_certificate_url?: string;
  parents_phone_number?: string;
  tenth_passing_year?: string;
  twelfth_passing_year?: string;
  neet_passing_year?: string;
  tenth_marksheet_number?: string;
  pcb_average?: number;
  neet_roll_number?: string;
  qualification_status?: "qualified" | "not_qualified";
}

const AddStudent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert form data to database format
  const toStudentDB = (formData: ComprehensiveStudentFormData): StudentDB => {
    // Safely get the agent ID if the user is an agent
    let agentId: number | undefined;
    if (user?.role === 'agent' && user.id) {
      agentId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
    }

    return {
      first_name: formData.first_name,
      last_name: formData.last_name,
      father_name: formData.father_name,
      mother_name: formData.mother_name,
      date_of_birth: formData.date_of_birth,
      phone_number: formData.phone_number,
      email: formData.email,
      university_id: Number(formData.university_id),
      course_id: Number(formData.course_id),
      academic_session_id: Number(formData.academic_session_id),
      status: 'enrolled',
      agent_id: agentId || formData.agent_id,
      admission_number: formData.admission_number,
      city: formData.city,
      country: formData.country,
      address: formData.address,
      aadhaar_number: formData.aadhaar_number,
      passport_number: formData.passport_number,
      scores: formData.scores,
      twelfth_marks: formData.twelfth_marks,
      photo_url: formData.photo_url,
      passport_copy_url: formData.passport_copy_url,
      aadhaar_copy_url: formData.aadhaar_copy_url,
      twelfth_certificate_url: formData.twelfth_certificate_url,
      parents_phone_number: formData.parents_phone_number,
      tenth_passing_year: formData.tenth_passing_year,
      twelfth_passing_year: formData.twelfth_passing_year,
      neet_passing_year: formData.neet_passing_year,
      tenth_marksheet_number: formData.tenth_marksheet_number,
      pcb_average: formData.pcb_average,
      neet_roll_number: formData.neet_roll_number,
      qualification_status: formData.qualification_status,
    };
  };

  const handleSubmit = async (formData: ComprehensiveStudentFormData) => {
    try {
      setIsSubmitting(true);
      
      // Convert form data to database format
      const studentData = toStudentDB(formData);
      
      // Insert the student data
      const { data: newStudent, error } = await supabase
        .from('students')
        .insert([studentData] as const)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student added successfully!",
      });

      // Redirect to student details or back to list
      navigate(`/students/direct`);
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Add New Student</h2>
            <p className="text-muted-foreground">Fill in the details below to add a new student</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/students/direct")}
          >
            Back to Students
          </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <ComprehensiveStudentForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default AddStudent;
