import os
import re
from bson import ObjectId
from pymongo import MongoClient, ASCENDING, DESCENDING
from app.config import settings

class InMemoryCursor:
    def __init__(self, docs):
        self.docs = list(docs)

    def sort(self, key_or_list, direction=None):
        if isinstance(key_or_list, list):
            for k, d in reversed(key_or_list):
                rev = (d == DESCENDING or d == -1)
                self.docs.sort(key=lambda x: x.get(k, 0), reverse=rev)
        else:
            k = key_or_list
            rev = (direction == DESCENDING or direction == -1)
            self.docs.sort(key=lambda x: x.get(k, 0), reverse=rev)
        return self

    def skip(self, n):
        self.docs = self.docs[n:]
        return self

    def limit(self, n):
        self.docs = self.docs[:n]
        return self

    def __iter__(self):
        return iter(self.docs)

    def __len__(self):
        return len(self.docs)


class InMemoryCollection:
    def __init__(self, name):
        self.name = name
        self.docs = []

    def _matches(self, doc, query):
        if not query:
            return True
        for k, v in query.items():
            if k == "$or":
                sub_matches = False
                for subq in v:
                    if self._matches(doc, subq):
                        sub_matches = True
                        break
                if not sub_matches:
                    return False
            elif isinstance(v, dict):
                val = doc.get(k)
                for op, expected in v.items():
                    if op == "$regex":
                        flags = 0
                        if v.get("$options") == "i":
                            flags = re.IGNORECASE
                        if not re.search(str(expected), str(val or ""), flags=flags):
                            return False
                    elif op == "$gte":
                        if val is None or val < expected:
                            return False
                    elif op == "$lte":
                        if val is None or val > expected:
                            return False
                    elif op == "$ne":
                        if val == expected:
                            return False
                    elif op == "$exists":
                        if expected and k not in doc:
                            return False
                        if not expected and k in doc:
                            return False
            else:
                if str(doc.get(k)) != str(v):
                    return False
        return True

    def find(self, query=None, projection=None):
        query = query or {}
        matched = []
        for doc in self.docs:
            if self._matches(doc, query):
                item = dict(doc)
                if projection:
                    if projection.get("_id") == 0:
                        item.pop("_id", None)
                    if projection.get("password") == 0:
                        item.pop("password", None)
                    if projection.get("user_email") == 0:
                        item.pop("user_email", None)
                matched.append(item)
        return InMemoryCursor(matched)

    def find_one(self, query=None, projection=None):
        cursor = self.find(query, projection)
        results = list(cursor)
        return results[0] if results else None

    def insert_one(self, document):
        doc = dict(document)
        if "_id" not in doc:
            doc["_id"] = ObjectId()
        self.docs.append(doc)
        class InsertResult:
            inserted_id = doc["_id"]
        return InsertResult()

    def update_one(self, filter_q, update_q, upsert=False):
        matched = None
        for i, doc in enumerate(self.docs):
            if self._matches(doc, filter_q):
                matched = (i, doc)
                break
        if matched:
            idx, doc = matched
            new_doc = dict(doc)
            if "$set" in update_q:
                new_doc.update(update_q["$set"])
            self.docs[idx] = new_doc
            return
        elif upsert:
            new_doc = dict(filter_q)
            if "$set" in update_q:
                new_doc.update(update_q["$set"])
            self.insert_one(new_doc)

    def delete_one(self, filter_q):
        for i, doc in enumerate(self.docs):
            if self._matches(doc, filter_q):
                del self.docs[i]
                return True
        return False

    def count_documents(self, query=None):
        return len(list(self.find(query)))


class InMemoryDatabase:
    def __init__(self):
        self._collections = {}

    def __getitem__(self, name):
        if name not in self._collections:
            self._collections[name] = InMemoryCollection(name)
        return self._collections[name]


# ==================================================
# MongoDB Connection Initialization
# ==================================================

database = None
client = None

try:
    if settings.MONGO_URI:
        client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=3000)
        client.admin.command("ping")
        print(" Connected to MongoDB Atlas!")
        database = client[settings.DATABASE_NAME or "billbuddy"]
except Exception as e:
    print(f"⚠️ Primary MongoDB connection failed: {e}")
    # Try localhost fallback
    try:
        client = MongoClient("mongodb://127.0.0.1:27017", serverSelectionTimeoutMS=1000)
        client.admin.command("ping")
        print(" Connected to Local MongoDB!")
        database = client[settings.DATABASE_NAME or "billbuddy"]
    except Exception:
        print("ℹ️ Using resilient in-memory database fallback (all operations will work in memory).")
        database = InMemoryDatabase()

user_collection = database["users"]
bill_collection = database["bills"]
budget_collection = database["budgets"]
goals_collection = database["goals"]
