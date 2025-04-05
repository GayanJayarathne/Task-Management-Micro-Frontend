import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Flex,
  Form,
  message,
  Space,
  Table,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import { EyeOutlined, RestOutlined } from "@ant-design/icons";
import TaskForm, { FormFieldType } from "./TaskForm";
import { getArrayFromLocalStorage } from "../utils/helpers";
import api from "../sevices/api";

interface DataType {
  name: string;
  description: string;
  dateRange: { startDate: string; endDate: string };
  userId: { _id: string; firstName: string; lastName: string };
  isEnabled: boolean;
  completionDate: Date;
  isCompleted: boolean;
}

const TaskTable = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("EDIT");
  const [messageApi, contextHolder] = message.useMessage();
  const [taskData, setTaskData] = useState<any[]>();
  const [taskByIdData, setTaskByIdData] = useState<FormFieldType>();

  const userData = getArrayFromLocalStorage("user");

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Task Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (_, record) => <>{record.dateRange.startDate}</>,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (_, record) => <>{record.dateRange.endDate}</>,
    },
    {
      title: "User",
      dataIndex: "userId",
      key: "userId",
      render: (_, record) => (
        <>{`${record.userId.firstName} ${record.userId.lastName}`}</>
      ),
    },
    {
      title: "Active",
      dataIndex: "isEnabled",
      key: "isEnabled",
      render: (_, record) => <>{record.isEnabled ? "Active" : "Inactive"}</>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => onEditTask(record)} />
          <Button
            disabled={true}
            icon={<RestOutlined />}
            onClick={() => onDeleteUser(record)}
          />
        </Space>
      ),
    },
  ];

  const getTaskById = async (id: string) => {
    try {
      const response = await api.get("/tasks/" + id);
      setTaskByIdData(response.data.data);
      console.log(response.data.data);
      showDrawer();
    } catch (error) {
      console.error(error);
    }
  };

  const getTaskList = async (id: string) => {
    try {
      const response = await api.get("/tasks/user/" + id);
      setTaskData(response.data.data);
      success("fetched");
    } catch (error) {
      console.error(error);
      errorMessage();
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await api.delete("/tasks/" + id);
      console.log(response.data);
      success("fetched");
    } catch (error) {
      console.error(error);
      errorMessage();
    }
  };

  const success = (message: string) => {
    messageApi.open({
      type: "success",
      content: `Successfully ${message}`,
    });
  };

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "Something went wrong, Please try again",
    });
  };

  const onEditTask = (row: any) => {
    getTaskById(row._id);
  };

  const onDeleteUser = (row: any) => {
    deleteTask(row._id).then((r) => getTaskList(userData.id));
  };

  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onSuccess = () => {
    success("updated");
    getTaskList(userData.id);
    onClose();
  };

  useEffect(() => {
    if (userData.id) {
      getTaskList(userData.id);
    }
  }, []);

  const handleSubmit = () => {
    form.submit();
  };

  return (
    <Flex vertical>
      <Flex justify="space-between">
        <Typography>My Tasks</Typography>
      </Flex>
      <Table<DataType>
        columns={columns}
        dataSource={taskData && taskData.length > 0 ? taskData : []}
      />
      <Drawer
        title="View task"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        {taskByIdData && (
          <TaskForm
            form={form}
            onSuccess={onSuccess}
            formData={taskByIdData}
            type={type}
          />
        )}
      </Drawer>
      {contextHolder}
    </Flex>
  );
};

export default TaskTable;
