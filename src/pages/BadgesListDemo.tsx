import React, { useState } from 'react';
import { BadgesList } from '@/components/ui/badges-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BadgesListDemo = () => {
  const [tags, setTags] = useState<string[]>([
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Vite',
    'Zustand',
  ]);

  const [categories, setCategories] = useState<string[]>([
    'Frontend',
    'Backend',
    'DevOps',
    'Design',
  ]);

  const [skills, setSkills] = useState<string[]>([
    'JavaScript',
    'Python',
    'Docker',
    'Kubernetes',
    'AWS',
  ]);

  const [newTag, setNewTag] = useState('');

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Badges List Component Demo</h1>
        <p className="text-muted-foreground">
          Interactive badges with remove functionality
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Default Variant - Technology Tags</CardTitle>
          <CardDescription>
            Click the X icon to remove a tag. {tags.length} tags remaining.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BadgesList
            items={tags}
            onRemove={handleRemoveTag}
            badgeVariant="default"
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="new-tag">Add New Tag</Label>
              <Input
                id="new-tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter tag name..."
              />
            </div>
            <Button onClick={handleAddTag} className="mt-6">
              Add Tag
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Secondary Variant - Categories</CardTitle>
          <CardDescription>
            Remove categories by clicking the X. {categories.length} categories active.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BadgesList
            items={categories}
            onRemove={handleRemoveCategory}
            badgeVariant="secondary"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outline Variant - Skills</CardTitle>
          <CardDescription>
            Manage your skills list. {skills.length} skills listed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BadgesList
            items={skills}
            onRemove={handleRemoveSkill}
            badgeVariant="outline"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empty State Example</CardTitle>
          <CardDescription>
            What happens when all badges are removed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BadgesList
            items={[]}
            onRemove={() => {}}
            badgeVariant="default"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {tags.length === 0 && categories.length === 0 && skills.length === 0
              ? 'All badges removed!'
              : 'Remove all badges above to see empty state'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setTags(['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Zustand']);
              setCategories(['Frontend', 'Backend', 'DevOps', 'Design']);
              setSkills(['JavaScript', 'Python', 'Docker', 'Kubernetes', 'AWS']);
            }}
          >
            Reset All
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setTags([]);
              setCategories([]);
              setSkills([]);
            }}
          >
            Clear All
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgesListDemo;
