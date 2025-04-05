import React, { useEffect } from "react";
import {
  Col,
  DatePicker,
  Divider,
  Form,
  FormProps,
  GetProps,
  Input,
  message,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
// import { useUpdateTaskMutation } from "../store/api/taskApiSlice";
import { isError } from "node:util";
import api from "../sevices/api";

dayjs.extend(utc);

type DatePickerProps = GetProps<typeof DatePicker>;

type FieldType = {
  name: string;
  description: string;
  dateRange: any[];
  userId: string;
  isEnabled: boolean;
  completionDate: Date;
  isCompleted: boolean;
};

export type FormFieldType = {
  name: string;
  description: string;
  dateRange: { startDate: string; endDate: string };
  userId: string;
  isEnabled: boolean;
  isCompleted: boolean;
  completionDate: Date;
};

interface UserFormProps {
  form: any;
  onSuccess: () => void;
  formData: FormFieldType;
  type: string;
}
const { RangePicker } = DatePicker;

const dateFormat = "YYYY/MM/DD";

const TaskForm: React.FC<UserFormProps> = ({
  form,
  onSuccess,
  formData,
  type,
}) => {
  const updateTask = async (data: any) => {
    try {
      const response = await api.put("/tasks/" + data._id, data);
      onSuccess();
      console.log(response);
    } catch (error) {
      console.error(error);
      errorMessage();
    }
  };

  const [messageApi, contextHolder] = message.useMessage();

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "Something went wrong, Please try again",
    });
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const formattedValues = {
      ...values,
      dateRange: {
        startDate: dayjs(values.dateRange[0]).format("YYYY-MM-DD"),
        endDate: dayjs(values.dateRange[1]).format("YYYY-MM-DD"),
      },
      completionDate: dayjs(values.completionDate).format("YYYY-MM-DD"),
    };
    console.log("values:", { formattedValues }, { values });
    if (type === "EDIT") {
      const payload = {
        ...formData,
        ...formattedValues,
      };
      updateTask(payload);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (type === "NEW") {
      form.setFieldsValue({ isEnabled: false });
    } else if (formData && type === "EDIT") {
      form.setFieldsValue({
        name: formData.name,
        description: formData.description,
        dateRange: [
          dayjs(formData.dateRange.startDate),
          dayjs(formData.dateRange.endDate),
        ],
        userId: formData.userId,
        isEnabled: formData.isEnabled,
        isCompleted: formData.isCompleted,
        completionDate: dayjs(formData.completionDate),
      });
    }
  }, [formData, type, form]);

  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        hideRequiredMark
        initialValues={{ isEnabled: false }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Task Name"
              rules={[{ required: true, message: "Task Name is required" }]}
            >
              <Input disabled={true} placeholder="Enter task name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dateRange"
              label="Date Range"
              rules={[{ required: true, message: "Date Range is required" }]}
            >
              <RangePicker disabled={true} format={dateFormat} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="description" label="Description">
              <Input.TextArea
                disabled={true}
                rows={4}
                placeholder="Enter description"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="isEnabled" label="Enable">
              <Switch disabled={true} defaultChecked={false} />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Typography>Please answer follow</Typography>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="isCompleted" label="Completed?">
              <Switch defaultChecked={false} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="completionDate"
              label="Completion Date"
              rules={[{ required: true, message: "Completion Date required" }]}
            >
              <DatePicker disabledDate={disabledDate} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {contextHolder}
    </>
  );
};

export default TaskForm;
