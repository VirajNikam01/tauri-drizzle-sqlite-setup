import React, { useEffect, useState } from "react";
import { db, schema } from "./lib/db";
import { eq } from "drizzle-orm";
import { faker } from "@faker-js/faker";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { BeatLoader } from "react-spinners";

// Styled Components
const Container = styled.div`
  padding: 24px;
  font-family: "Inter", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: ${(props) => (props.danger ? "#dc2626" : "#2563eb")};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;

  &:hover {
    background-color: ${(props) => (props.danger ? "#b91c1c" : "#1d4ed8")};
  }

  &:disabled {
    background-color: ${(props) => (props.danger ? "#f87171" : "#93c5fd")};
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  font-size: 14px;
  margin-top: 12px;
  background-color: #fef2f2;
  padding: 12px;
  border-radius: 6px;
`;

const TableContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #1f2a44;
  border-bottom: 1px solid #f3f4f6;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9fafb;
  }
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const App = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [isSmallBulkLoading, setIsSmallBulkLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function demo() {
    setIsLoading(true);
    setError(null);
    try {
      const existingUser = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.name, "Alice"))
        .limit(1);

      if (existingUser.length === 0) {
        console.log("Inserting new user...");
        await db.insert(schema.users).values({ name: "Alice" });
      }

      const result = await db.select().from(schema.users);
      setData(result);
    } catch (err) {
      console.error("Database error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function insertBulkUsers(count) {
    const isSmallBatch = count === 50;
    if (isSmallBatch) {
      setIsSmallBulkLoading(true);
    } else {
      setIsBulkLoading(true);
    }
    setError(null);
    try {
      const usersToInsert = Array.from({ length: count }, () => ({
        name: faker.person.firstName(),
      }));

      await db.insert(schema.users).values(usersToInsert);
      const result = await db.select().from(schema.users);
      setData(result);
    } catch (err) {
      console.error(`Bulk insert (${count}) error:`, err);
      setError(err.message);
    } finally {
      if (isSmallBatch) {
        setIsSmallBulkLoading(false);
      } else {
        setIsBulkLoading(false);
      }
    }
  }

  async function deleteAllUsers() {
    if (
      !window.confirm(
        "Are you sure you want to delete all users? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    try {
      await db.delete(schema.users);
      const result = await db.select().from(schema.users);
      setData(result);
    } catch (err) {
      console.error("Delete all error:", err);
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    demo();
  }, []);

  return (
    <Container>
      <Title>Employee Management</Title>
      <ButtonGroup>
        <Button
          onClick={() => insertBulkUsers(50)}
          disabled={isSmallBulkLoading || isBulkLoading || isDeleting}
        >
          {isSmallBulkLoading ? (
            <>
              <BeatLoader size={8} color="#ffffff" />
              Inserting...
            </>
          ) : (
            "Insert 50 Users"
          )}
        </Button>
        <Button
          onClick={() => insertBulkUsers(500)}
          disabled={isBulkLoading || isSmallBulkLoading || isDeleting}
        >
          {isBulkLoading ? (
            <>
              <BeatLoader size={8} color="#ffffff" />
              Inserting...
            </>
          ) : (
            "Insert 500 Users"
          )}
        </Button>
        <Button
          danger
          onClick={deleteAllUsers}
          disabled={
            isDeleting ||
            isBulkLoading ||
            isSmallBulkLoading ||
            data.length === 0
          }
        >
          {isDeleting ? (
            <>
              <BeatLoader size={8} color="#ffffff" />
              Deleting...
            </>
          ) : (
            "Delete All Users"
          )}
        </Button>
      </ButtonGroup>
      <InfoText>Total Users: {data.length}</InfoText>
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}
      {isLoading ? (
        <LoadingContainer>
          <BeatLoader size={12} color="#2563eb" />
        </LoadingContainer>
      ) : data.length === 0 ? (
        <InfoText>No users found.</InfoText>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>Name</TableHeader>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default App;
